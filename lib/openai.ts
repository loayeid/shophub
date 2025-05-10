import axios from 'axios';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1';
const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY;

console.log('OPENAI_API_KEY loaded:', !!OPENAI_API_KEY);

if (!OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set in environment variables');
}

// Local fallback for AI description and image generation
// Enhanced Amazon-style local AI description generator
export async function generateDescription(prompt: string) {
  const match = prompt.match(/product called \"(.+?)\". Features: (.*)/i);
  const productName = match ? match[1] : 'Product';
  const features = match && match[2] && match[2] !== 'N/A' ? match[2].split(/,|\n|•/).map(f => f.trim()).filter(Boolean) : [];
  const adjectives = [
    'innovative', 'premium', 'ergonomic', 'sleek', 'versatile', 'cutting-edge',
    'user-friendly', 'durable', 'compact', 'stylish', 'high-performance', 'advanced',
    'lightweight', 'portable', 'energy-efficient', 'multi-functional', 'top-rated', 'best-selling',
    'award-winning', 'state-of-the-art', 'eco-friendly', 'affordable', 'trusted', 'modern', 'classic'
  ];
  const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const aboutItem = [
    `Experience the next level of convenience with the ${randomAdj} ${productName}.`,
    `Designed for those who value quality and performance, the ${productName} is your perfect companion for everyday tasks.`,
    `Upgrade your lifestyle with the ${productName}—crafted to deliver reliability and satisfaction.`,
    `The ${productName} combines style and substance, making it a must-have for any modern user.`,
    `Discover the difference with the ${productName}, engineered for excellence.`,
    `Enjoy seamless functionality and elegant design with the ${productName}.`,
    `A smart choice for those who demand more from their products: the ${productName}.`,
  ];
  const randomAbout = aboutItem[Math.floor(Math.random() * aboutItem.length)];
  const whyLove = [
    `Why you'll love it:`,
    `What makes it special:`,
    `Customer favorite because:`,
    `Standout benefits:`,
    `Top reasons to choose this product:`,
  ];
  const randomWhy = whyLove[Math.floor(Math.random() * whyLove.length)];
  const whyLoveDetails = [
    'Exceptional build quality and attention to detail.',
    'Backed by outstanding customer reviews.',
    'Easy to use and maintain.',
    'Designed with your needs in mind.',
    'Great value for the price.',
    'Trusted by thousands of happy customers.',
    'Perfect for home, office, or travel.',
    'Engineered for long-lasting performance.',
    'Comes with a comprehensive warranty for peace of mind.',
    'Energy-efficient and environmentally friendly.',
    'Compact design saves space without sacrificing features.',
    'Modern aesthetics fit any decor.',
    'Simple setup and intuitive controls.',
    'Responsive customer support team.',
    'Made from high-quality, sustainable materials.',
    'Award-winning design and functionality.',
  ];
  // Pick 3-5 random why-love details
  const shuffledWhy = whyLoveDetails.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 3);
  // Build features list
  let featuresList = '';
  if (features.length > 0) {
    featuresList = '\nProduct Features:';
    features.forEach(f => {
      featuresList += `\n• ${f}`;
    });
  }
  // Add a technical specs section
  let techSpecs = '';
  if (features.length > 0) {
    techSpecs = '\n\nTechnical Specifications:';
    features.forEach((f, i) => {
      techSpecs += `\n- Spec ${i + 1}: ${f}`;
    });
  }
  // Add a warranty and support section
  const warranty = '\n\nWarranty & Support:\n- 1-year limited warranty included.\n- 24/7 customer support available.';
  // Add a customer review snippet
  const reviews = [
    '“Absolutely love this product! It exceeded my expectations.”',
    '“Great value for the price. Highly recommended!”',
    '“The quality is top-notch and the design is beautiful.”',
    '“I use it every day and it works flawlessly.”',
    '“Customer service was very helpful and responsive.”',
    '“Would definitely buy again!”',
  ];
  const randomReview = reviews[Math.floor(Math.random() * reviews.length)];
  return `About this item:\n${randomAbout}${featuresList}\n\n${randomWhy}\n- ${shuffledWhy.join('\n- ')}${techSpecs}${warranty}\n\nCustomer Review:\n${randomReview}\n\nOrder now and enjoy fast shipping and great support!`;
}

// Enhanced local AI image generator with style options
const imageStyles = [
  'photorealistic',
  'cartoon',
  'sketch',
  '3D render',
  'minimalist',
  'vintage',
  'futuristic',
];

export async function generateImage(prompt: string) {
  if (!PIXABAY_API_KEY) {
    // fallback to placeholder if no API key
    return `https://via.placeholder.com/512x512.png?text=${encodeURIComponent(prompt)}`;
  }
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: PIXABAY_API_KEY,
        q: prompt,
        image_type: 'photo',
        safesearch: true,
        per_page: 3,
      },
    });
    const hits = response.data.hits;
    if (hits && hits.length > 0) {
      return hits[0].webformatURL;
    } else {
      // fallback if no image found
      return `https://via.placeholder.com/512x512.png?text=No+Image+Found`;
    }
  } catch (error) {
    // fallback on error
    return `https://via.placeholder.com/512x512.png?text=Error`;
  }
}
