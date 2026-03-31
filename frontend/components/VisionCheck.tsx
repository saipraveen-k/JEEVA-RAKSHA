import { useState } from 'react';
import { Camera, CheckCircle, XCircle, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface VisionCheckProps {
  imageFile: File | null;
  onValidationComplete: (result: { isAnimal: boolean; confidence: number }) => void;
}

export default function VisionCheck({ imageFile, onValidationComplete }: VisionCheckProps) {
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<{
    isAnimal: boolean;
    confidence: number;
    labels?: Array<{ label: string; confidence: number }>;
    source?: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const performVisionCheck = async () => {
    if (!imageFile) {
      setError('Please select an image first');
      return;
    }

    setChecking(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await fetch('http://localhost:5000/api/vision-check', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        const visionResult = {
          isAnimal: data.isAnimal,
          confidence: data.confidence,
          labels: data.detectedLabels,
          source: data.source
        };
        setResult(visionResult);
        onValidationComplete(visionResult);
      } else {
        setError(data.message || 'Failed to analyze image');
      }
    } catch (error) {
      console.error('Vision check error:', error);
      setError('Network error. Please try again.');
      // For demo purposes, provide mock result on error
      const mockResult = {
        isAnimal: Math.random() > 0.3,
        confidence: Math.floor(Math.random() * 40) + 60,
        source: 'Mock Detection (Demo Mode)'
      };
      setResult(mockResult);
      onValidationComplete(mockResult);
    } finally {
      setChecking(false);
    }
  };

  const resetCheck = () => {
    setResult(null);
    setError(null);
  };

  if (!imageFile) {
    return null;
  }

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Camera className="w-4 h-4 text-blue-600" />
          <h4 className="font-medium text-blue-800">Image Validation</h4>
        </div>

        {!result && !checking && (
          <div className="space-y-3">
            <p className="text-sm text-blue-700">
              Check if this image contains an animal using AI vision detection.
            </p>
            <Button 
              onClick={performVisionCheck} 
              variant="outline" 
              size="sm"
              className="w-full"
            >
              <Camera className="w-4 h-4 mr-2" />
              Analyze Image
            </Button>
          </div>
        )}

        {checking && (
          <div className="flex flex-col items-center py-4 space-y-2">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-sm text-blue-700">Analyzing image...</p>
            <p className="text-xs text-blue-600">Using AI to detect animals</p>
          </div>
        )}

        {result && (
          <div className="space-y-3">
            <div className={`flex items-center gap-2 p-3 rounded-lg ${
              result.isAnimal ? 'bg-green-100 border border-green-200' : 'bg-yellow-100 border border-yellow-200'
            }`}>
              {result.isAnimal ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-yellow-600" />
              )}
              <div className="flex-1">
                <p className={`font-medium ${
                  result.isAnimal ? 'text-green-800' : 'text-yellow-800'
                }`}>
                  {result.isAnimal ? 'Animal Detected ✅' : 'No Animal Detected ⚠️'}
                </p>
                <p className="text-sm text-gray-600">
                  Confidence: {result.confidence}%
                </p>
                {result.source && (
                  <p className="text-xs text-gray-500">
                    Source: {result.source}
                  </p>
                )}
              </div>
            </div>

            {result.labels && result.labels.length > 0 && (
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-2">Detected Labels:</p>
                <div className="flex flex-wrap gap-2">
                  {result.labels.map((label, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {label.label} ({label.confidence}%)
                    </span>
                  ))}
                </div>
              </div>
            )}

            {!result.isAnimal && (
              <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium">Note:</p>
                    <p>The AI couldn't detect an animal in this image. You can still submit the case if you're sure it contains an animal.</p>
                  </div>
                </div>
              </div>
            )}

            <Button 
              onClick={resetCheck} 
              variant="outline" 
              size="sm"
              className="w-full"
            >
              Check Again
            </Button>
          </div>
        )}

        {error && (
          <div className="bg-red-50 rounded-lg p-3 border border-red-200">
            <div className="flex items-start gap-2">
              <XCircle className="w-4 h-4 text-red-600 mt-0.5" />
              <div className="text-sm text-red-800">
                <p className="font-medium">Error:</p>
                <p>{error}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
