"use client"
import React, { useState } from 'react';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import Image from 'next/image';

export default function ProductAIGenerator() {
  const [productName, setProductName] = useState('');
  const [features, setFeatures] = useState('');
  const [imagePrompt, setImagePrompt] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loadingDesc, setLoadingDesc] = useState(false);
  const [loadingImg, setLoadingImg] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateDescription = async () => {
    setLoadingDesc(true);
    setError('');
    setDescription('');
    try {
      const res = await fetch('/api/ai/description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productName, features }),
      });
      const data = await res.json();
      if (data.description) setDescription(data.description);
      else setError(data.error || 'Failed to generate description');
    } catch (e) {
      setError('Failed to generate description');
    }
    setLoadingDesc(false);
  };

  const handleGenerateImage = async () => {
    setLoadingImg(true);
    setError('');
    setImageUrl('');
    try {
      const res = await fetch('/api/ai/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: imagePrompt || productName }),
      });
      const data = await res.json();
      if (data.imageUrl) setImageUrl(data.imageUrl);
      else setError(data.error || 'Failed to generate image');
    } catch (e) {
      setError('Failed to generate image');
    }
    setLoadingImg(false);
  };

  return (
    <Card className="p-6 max-w-xl mx-auto space-y-4">
      <h2 className="text-xl font-bold mb-2">AI Product Description & Image Generator</h2>
      <div className="space-y-2">
        <Input
          placeholder="Product Name"
          value={productName}
          onChange={e => setProductName(e.target.value)}
        />
        <Textarea
          placeholder="Features (comma separated or bullet points)"
          value={features}
          onChange={e => setFeatures(e.target.value)}
        />
        <Button onClick={handleGenerateDescription} disabled={loadingDesc || !productName}>
          {loadingDesc ? 'Generating Description...' : 'Generate Description'}
        </Button>
        {description && (
          <div className="bg-gray-100 p-3 rounded mt-2">
            <strong>Description:</strong>
            <p>{description}</p>
          </div>
        )}
      </div>
      <div className="space-y-2 pt-4 border-t">
        <Input
          placeholder="Image Prompt (optional, defaults to product name)"
          value={imagePrompt}
          onChange={e => setImagePrompt(e.target.value)}
        />
        <Button onClick={handleGenerateImage} disabled={loadingImg || !productName}>
          {loadingImg ? 'Generating Image...' : 'Generate Image'}
        </Button>
        {imageUrl && (
          <div className="mt-2">
            <strong>Generated Image:</strong>
            <div className="relative w-64 h-64 mt-1">
              <Image
                src={imageUrl}
                alt="Generated product"
                fill
                className="rounded border object-contain"
                sizes="256px"
                priority
              />
            </div>
          </div>
        )}
      </div>
      {error && <div className="text-red-500 mt-2">{error}</div>}
    </Card>
  );
}
