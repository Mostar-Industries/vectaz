
import React, { useState, useEffect } from 'react';
import { loadDecisionMatrix, MatrixData, storeDecisionMatrix, retrieveDecisionMatrix } from '@/utils/decisionMatrixParser';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const DecisionMatrix: React.FC = () => {
  const [matrixData, setMatrixData] = useState<MatrixData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [calculationResult, setCalculationResult] = useState<any>(null);

  // Load matrix data on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      // Try to load from Supabase first
      const dbMatrix = await retrieveDecisionMatrix();
      
      if (dbMatrix && dbMatrix.rows.length > 0) {
        setMatrixData(dbMatrix);
      } else {
        // If not in database, load from CSV file
        const csvMatrix = await loadDecisionMatrix();
        setMatrixData(csvMatrix);
        
        // Store in Supabase for future use
        if (csvMatrix.rows.length > 0) {
          await storeDecisionMatrix(csvMatrix);
        }
      }
      
      setIsLoading(false);
    };
    
    loadData();
    
    // Set up Supabase realtime subscription for calculation results
    const channel = supabase
      .channel('matrix_results')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'calculation_results' },
        (payload) => {
          toast({
            title: "New Result Available",
            description: "A new calculation result has been received",
          });
          setCalculationResult(payload.new);
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Run a calculation on the decision matrix
  const runCalculation = async () => {
    if (!matrixData || matrixData.rows.length === 0) {
      toast({
        title: "Error",
        description: "No matrix data available to process",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Call the Edge Function to process the matrix
      const { data, error } = await supabase.functions.invoke('process-decision-matrix', {
        body: { matrix: matrixData.rows }
      });
      
      if (error) throw error;
      
      setCalculationResult(data);
      toast({
        title: "Success",
        description: "Matrix calculation completed successfully",
      });
    } catch (error) {
      console.error("Error processing matrix:", error);
      toast({
        title: "Calculation Error",
        description: "Failed to process the matrix. Using TypeScript fallback.",
        variant: "destructive",
      });
      
      // Fallback to simple TypeScript calculation
      const simpleResult = {
        scores: matrixData.rows.map(row => 
          row.reduce((sum, val) => sum + val, 0) / row.length
        ),
        method: "ts-fallback",
        timestamp: new Date().toISOString()
      };
      
      setCalculationResult(simpleResult);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6 flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading decision matrix...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Decision Matrix</CardTitle>
        <CardDescription>
          Neutrosophic AHP-TOPSIS matrix data for decision engine
        </CardDescription>
      </CardHeader>
      <CardContent>
        {matrixData && matrixData.rows.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Row/Col</TableHead>
                  {Array.from({ length: matrixData.columnCount }).map((_, idx) => (
                    <TableHead key={`col-${idx}`}>Column {idx + 1}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {matrixData.rows.map((row, rowIdx) => (
                  <TableRow key={`row-${rowIdx}`}>
                    <TableCell className="font-medium">Row {rowIdx + 1}</TableCell>
                    {row.map((cell, cellIdx) => (
                      <TableCell key={`cell-${rowIdx}-${cellIdx}`}>{cell.toFixed(3)}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            No matrix data available
          </div>
        )}
        
        {calculationResult && (
          <div className="mt-8 border rounded-md p-4">
            <h3 className="text-lg font-medium mb-2">Calculation Results</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Method:</p>
                <p className="font-medium">{calculationResult.method || "Standard"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Timestamp:</p>
                <p className="font-medium">
                  {new Date(calculationResult.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-2">Scores:</p>
              <div className="grid grid-cols-3 gap-2">
                {calculationResult.scores && calculationResult.scores.map((score: number, idx: number) => (
                  <div key={`score-${idx}`} className="bg-muted p-2 rounded-md">
                    <span className="text-sm text-muted-foreground">Item {idx + 1}:</span>
                    <span className="ml-2 font-medium">{score.toFixed(4)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => loadDecisionMatrix()}>
          Reload Matrix
        </Button>
        <Button onClick={runCalculation} disabled={isProcessing}>
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Run Calculation'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DecisionMatrix;
