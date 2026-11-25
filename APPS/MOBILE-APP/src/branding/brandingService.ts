export interface TempleBranding {
  id: string;
  name: string;
  description: string;
  logo: string;
  splashScreen: string;
  homeBanner: string;
  images: string[];
  primaryColor: string;
  secondaryColor: string;
  contact: {
    phone: string;
    email: string;
    address: string;
  };
  social: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    website?: string;
  };
}

export const mockTemplesList: TempleBranding[] = [
  {
    id: "temple_001",
    name: "Shree Venkateswara Swamy",
    description: "A historic and spiritually significant temple dedicated to Lord Venkateswara.",
    logo: "https://via.placeholder.com/150",
    splashScreen: "https://via.placeholder.com/1080x1920",
    homeBanner: "https://via.placeholder.com/800x400",
    images: ["https://via.placeholder.com/400x300"],
    primaryColor: "#431282",
    secondaryColor: "#FFB800",
    contact: { phone: "+91 9876543210", email: "info@temple.com", address: "Tirupati, AP" },
    social: { website: "https://temple.com" }
  },
  {
    id: "temple_002",
    name: "Kashi Vishwanath Temple",
    description: "One of the most famous Hindu temples dedicated to Lord Shiva.",
    logo: "https://via.placeholder.com/150",
    splashScreen: "https://via.placeholder.com/1080x1920",
    homeBanner: "https://via.placeholder.com/800x400",
    images: ["https://via.placeholder.com/400x300"],
    primaryColor: "#E65100", // Orange
    secondaryColor: "#FFD54F",
    contact: { phone: "+91 9876543211", email: "contact@kashivishwanath.com", address: "Varanasi, UP" },
    social: { website: "https://kashivishwanath.com" }
  },
  {
    id: "temple_003",
    name: "Meenakshi Amman Temple",
    description: "A historic Hindu temple located on the southern bank of the Vaigai River.",
    logo: "https://via.placeholder.com/150",
    splashScreen: "https://via.placeholder.com/1080x1920",
    homeBanner: "https://via.placeholder.com/800x400",
    images: ["https://via.placeholder.com/400x300"],
    primaryColor: "#00695C", // Teal
    secondaryColor: "#FFB300",
    contact: { phone: "+91 9876543212", email: "info@meenakshi.com", address: "Madurai, TN" },
    social: { website: "https://meenakshi.com" }
  }
];

export const fetchTemplesList = async (): Promise<TempleBranding[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockTemplesList);
    }, 500);
  });
};

export const fetchTempleBranding = async (id: string): Promise<TempleBranding> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const temple = mockTemplesList.find(t => t.id === id);
      if (temple) resolve(temple);
      else reject(new Error("Temple not found"));
    }, 500);
  });
};
