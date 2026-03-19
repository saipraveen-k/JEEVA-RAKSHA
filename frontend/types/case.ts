export interface Case {
  _id: string;
  animalType: string;
  description: string;
  image?: string;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  status: 'pending' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt?: string;
  createdBy?: {
    _id: string;
    name: string;
    email: string;
  };
  assignedTo?: {
    _id: string;
    name: string;
    email: string;
  };
  notes?: Array<{
    content: string;
    addedBy: {
      _id: string;
      name: string;
      email: string;
    };
    addedAt: string;
  }>;
}
