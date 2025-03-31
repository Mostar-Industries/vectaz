
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { CheckCircle, XCircle, AlertCircle, Info, HelpCircle, Award } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface RankedForwarder {
  forwarder: string;
  score: number;
  closeness: number;
  costPerformance: number;
  timePerformance: number;
  reliabilityPerformance: number;
  explanation?: any;
}

interface ForwarderRankingProps {
  rankings: RankedForwarder[];
  onExplain: (forwarder: string) => void;
  isLoading?: boolean;
}

const ForwarderRanking: React.FC<ForwarderRankingProps> = ({ 
  rankings, 
  onExplain,
  isLoading = false 
}) => {
  if (isLoading) {
    return (
      <div className="bg-card animate-pulse rounded-lg h-96 border"></div>
    );
  }

  if (!rankings || rankings.length === 0) {
    return (
      <div className="bg-card rounded-lg h-96 border flex items-center justify-center">
        <div className="text-center">
          <HelpCircle className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">No forwarder ranking data available</p>
        </div>
      </div>
    );
  }

  // Format score to percentage with 1 decimal place
  const formatScore = (score: number) => `${(score * 100).toFixed(1)}%`;

  // Get color class based on performance
  const getPerformanceColor = (score: number) => {
    if (score >= 0.8) return "text-green-600";
    if (score >= 0.6) return "text-amber-600";
    return "text-red-600";
  };

  // Get icon based on performance
  const getPerformanceIcon = (score: number) => {
    if (score >= 0.8) return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (score >= 0.6) return <AlertCircle className="h-4 w-4 text-amber-600" />;
    return <XCircle className="h-4 w-4 text-red-600" />;
  };

  // Check if every ranking has an explanation
  const hasExplanations = rankings.every(entry => entry.explanation);

  return (
    <div className="bg-card rounded-lg border">
      <div className="p-4 border-b flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Forwarder Rankings (AHP-TOPSIS)</h3>
          <p className="text-sm text-muted-foreground">
            Based on cost, transit time, and reliability criteria
          </p>
        </div>
        {hasExplanations && (
          <Badge variant="outline" className="bg-primary/10 text-primary text-xs flex items-center">
            <Award className="h-3 w-3 mr-1" />
            PRIME ORIGIN PROTOCOL
          </Badge>
        )}
      </div>
      <div className="overflow-auto max-h-[500px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Rank</TableHead>
              <TableHead>Forwarder</TableHead>
              <TableHead className="text-right">Score</TableHead>
              <TableHead className="text-center">Cost</TableHead>
              <TableHead className="text-center">Time</TableHead>
              <TableHead className="text-center">Reliability</TableHead>
              <TableHead className="w-24"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rankings.map((forwarder, index) => (
              <TableRow key={forwarder.forwarder}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>
                  <div className="font-medium">{forwarder.forwarder}</div>
                </TableCell>
                <TableCell className="text-right font-medium">{formatScore(forwarder.score)}</TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center">
                    {getPerformanceIcon(forwarder.costPerformance)}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center">
                    {getPerformanceIcon(forwarder.timePerformance)}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center">
                    {getPerformanceIcon(forwarder.reliabilityPerformance)}
                  </div>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onExplain(forwarder.forwarder)}
                    className="flex items-center"
                  >
                    <HelpCircle className="h-4 w-4 mr-1" />
                    Explain
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {hasExplanations && (
        <div className="p-3 bg-primary/5 text-xs text-muted-foreground border-t">
          <div className="flex items-center">
            <Info className="h-3 w-3 mr-1 text-primary" />
            Rankings calculated using TOPSIS with Neutrosophic AHP for scientifically sound decision support
          </div>
        </div>
      )}
    </div>
  );
};

export default ForwarderRanking;
