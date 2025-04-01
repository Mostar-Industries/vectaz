# CORE/base_engine/py/dataUtils.py
from typing import List, Dict, Tuple, Optional
import pandas as pd
from datetime import datetime
import numpy as np
from scipy import stats
import json
from pathlib import Path
import warnings

# Suppress warnings for cleaner output
warnings.filterwarnings('ignore')

class DataUtils:
    """
    Core data processing utilities for DeepCAL engine
    Handles data validation, transformation, and metric calculations
    """
    
    @staticmethod
    def validate_shipments(shipments: List[Dict]) -> List[Dict]:
        """
        Validate shipment data against schema requirements
        Returns only valid shipments with added metadata flags
        """
        required_fields = {
            'request_reference': str,
            'origin_country': str,
            'destination_country': str,
            'weight_kg': (int, float),
            'date_of_collection': str,
            'final_quote_awarded_freight_forwader_Carrier': str,
            'mode_of_shipment': str
        }
        
        valid_shipments = []
        
        for shipment in shipments:
            try:
                # Type validation
                valid = all(
                    field in shipment and isinstance(shipment[field], type_check)
                    for field, type_check in required_fields.items()
                )
                
                # Value validation
                valid &= shipment['weight_kg'] > 0
                valid &= shipment['date_of_collection'] != ''
                
                if valid:
                    # Add validation metadata
                    shipment['_validated'] = True
                    shipment['_validation_errors'] = []
                    valid_shipments.append(shipment)
                else:
                    # Log invalid entries
                    invalid_reasons = [
                        f"{field} failed {type_check} check" 
                        for field, type_check in required_fields.items()
                        if field not in shipment or not isinstance(shipment[field], type_check)
                    ]
                    if shipment['weight_kg'] <= 0:
                        invalid_reasons.append("weight_kg <= 0")
                    if shipment['date_of_collection'] == '':
                        invalid_reasons.append("empty date_of_collection")
                    
                    print(f"Invalid shipment {shipment.get('request_reference', '')}: {', '.join(invalid_reasons)}")
                    
            except Exception as e:
                print(f"Validation error for shipment: {str(e)}")
                continue
                
        return valid_shipments

    @staticmethod
    def calculate_transit_days(shipment: Dict) -> Optional[float]:
        """Calculate transit time in days between collection and arrival"""
        try:
            if not shipment.get('date_of_arrival_destination'):
                return None
                
            collect_date = datetime.strptime(shipment['date_of_collection'], '%Y-%m-%d')
            arrive_date = datetime.strptime(shipment['date_of_arrival_destination'], '%Y-%m-%d')
            
            return (arrive_date - collect_date).total_seconds() / (24 * 3600)
        except:
            return None

    @staticmethod
    def calculate_cost_efficiency(shipment: Dict) -> Optional[float]:
        """Calculate cost per kg/CBM with validation"""
        try:
            forwarder = shipment['final_quote_awarded_freight_forwader_Carrier']
            cost = shipment['forwarder_quotes'][forwarder.lower()]
            weight = shipment['weight_kg']
            volume = shipment.get('volume_cbm', 0)
            
            if weight > 0:
                cost_per_kg = cost / weight
                if volume > 0:
                    cost_per_cbm = cost / volume
                    return min(cost_per_kg, cost_per_cbm)
                return cost_per_kg
            return None
        except:
            return None

    @staticmethod
    def calculate_historical_trends(shipments: List[Dict], window: str = '30D') -> Dict:
        """
        Calculate trends over time using pandas rolling windows
        Returns:
            {
                'on_time_rate': {'current': 0.85, 'trend': 0.02},
                'cost_efficiency': {'current': 2.45, 'trend': -0.15},
                ...
            }
        """
        try:
            df = pd.DataFrame(shipments)
            
            # Convert dates and calculate metrics
            df['date'] = pd.to_datetime(df['date_of_collection'])
            df['transit_days'] = df.apply(DataUtils.calculate_transit_days, axis=1)
            df['cost_eff'] = df.apply(DataUtils.calculate_cost_efficiency, axis=1)
            df['on_time'] = df['delivery_status'] == 'Delivered'
            
            # Set date index and sort
            df = df.set_index('date').sort_index()
            
            # Calculate rolling metrics
            results = {}
            metrics = {
                'on_time_rate': ('on_time', 'mean'),
                'avg_transit_days': ('transit_days', 'mean'),
                'cost_efficiency': ('cost_eff', 'mean')
            }
            
            for name, (col, func) in metrics.items():
                current = getattr(df[col].last(window), func)()
                historical = getattr(df[col].rolling(window), func)().iloc[-2]
                results[name] = {
                    'current': current,
                    'trend': current - historical,
                    'percent_change': ((current - historical) / historical) * 100
                }
                
            return results
        except Exception as e:
            print(f"Trend calculation error: {str(e)}")
            return {}

    @staticmethod
    def detect_anomalies(shipments: List[Dict]) -> Dict:
        """Identify statistical outliers in cost and transit times"""
        try:
            costs = []
            transit_times = []
            
            for s in shipments:
                cost_eff = DataUtils.calculate_cost_efficiency(s)
                transit = DataUtils.calculate_transit_days(s)
                
                if cost_eff:
                    costs.append(cost_eff)
                if transit:
                    transit_times.append(transit)
            
            anomalies = {
                'high_cost': {
                    'threshold': np.percentile(costs, 95),
                    'shipments': [
                        s['request_reference'] for s in shipments 
                        if DataUtils.calculate_cost_efficiency(s) and 
                           DataUtils.calculate_cost_efficiency(s) > np.percentile(costs, 95)
                    ]
                },
                'long_transit': {
                    'threshold': np.percentile(transit_times, 95),
                    'shipments': [
                        s['request_reference'] for s in shipments 
                        if DataUtils.calculate_transit_days(s) and 
                           DataUtils.calculate_transit_days(s) > np.percentile(transit_times, 95)
                    ]
                }
            }
            
            return anomalies
        except:
            return {}

    @staticmethod
    def load_reference_data() -> Dict:
        """Load all reference JSON files from base_reference"""
        reference_dir = Path(__file__).parent.parent / 'base_reference'
        data = {}
        
        for file in reference_dir.glob('*.json'):
            try:
                with open(file, 'r') as f:
                    data[file.stem] = json.load(f)
            except:
                print(f"Failed to load {file.name}")
                continue
                
        return data

    @staticmethod
    def calculate_mode_efficiency(shipments: List[Dict]) -> Dict:
        """Compare performance across shipping modes"""
        modes = {}
        
        for s in shipments:
            mode = s['mode_of_shipment']
            if mode not in modes:
                modes[mode] = {
                    'count': 0,
                    'total_cost': 0,
                    'total_weight': 0,
                    'transit_times': [],
                    'on_time_count': 0
                }
                
            modes[mode]['count'] += 1
            cost_eff = DataUtils.calculate_cost_efficiency(s)
            if cost_eff:
                modes[mode]['total_cost'] += cost_eff * s['weight_kg']
                modes[mode]['total_weight'] += s['weight_kg']
                
            transit = DataUtils.calculate_transit_days(s)
            if transit:
                modes[mode]['transit_times'].append(transit)
                
            if s.get('delivery_status') == 'Delivered':
                modes[mode]['on_time_count'] += 1
                
        # Calculate aggregates
        results = {}
        for mode, stats in modes.items():
            results[mode] = {
                'shipment_count': stats['count'],
                'avg_cost_per_kg': stats['total_cost'] / stats['total_weight'] if stats['total_weight'] > 0 else 0,
                'avg_transit_days': np.mean(stats['transit_times']) if stats['transit_times'] else 0,
                'on_time_rate': stats['on_time_count'] / stats['count'] if stats['count'] > 0 else 0,
                'cost_std_dev': np.std([DataUtils.calculate_cost_efficiency(s) 
                                      for s in shipments 
                                      if s['mode_of_shipment'] == mode and DataUtils.calculate_cost_efficiency(s)])
            }
            
        return results

    @staticmethod
    def prepare_engine_input(shipments: List[Dict]) -> Dict:
        """
        Transform raw shipments into optimized format for Core engine
        Returns:
            {
                'shipments': validated_shipments,
                'reference_data': loaded_reference,
                'metrics': {
                    'historical_trends': trends,
                    'anomalies': detected_anomalies,
                    'mode_efficiency': mode_stats
                }
            }
        """
        validated = DataUtils.validate_shipments(shipments)
        reference = DataUtils.load_reference_data()
        
        return {
            'shipments': validated,
            'reference_data': reference,
            'metrics': {
                'historical_trends': DataUtils.calculate_historical_trends(validated),
                'anomalies': DataUtils.detect_anomalies(validated),
                'mode_efficiency': DataUtils.calculate_mode_efficiency(validated)
            }
        }