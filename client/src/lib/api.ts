import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { 
  InsertProject, 
  Project, 
  InsertSupportMessage, 
  SupportMessage,
  ContactForm,
} from '@shared/schema';

export const projectsApi = {
  async create(userId: string, projectData: Omit<InsertProject, 'userId'>): Promise<Project> {
    const now = Date.now();
    const projectToCreate = {
      ...projectData,
      userId,
      status: 'pending' as const,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await addDoc(collection(db, 'projects'), projectToCreate);
    
    return {
      id: docRef.id,
      ...projectToCreate,
    };
  },

  async getByUserId(userId: string): Promise<Project[]> {
    const q = query(
      collection(db, 'projects'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Project[];
  },

  async getById(projectId: string): Promise<Project | null> {
    const docRef = doc(db, 'projects', projectId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }
    
    return {
      id: docSnap.id,
      ...docSnap.data(),
    } as Project;
  },

  async update(projectId: string, updates: Partial<Omit<Project, 'id' | 'userId' | 'createdAt'>>): Promise<void> {
    const docRef = doc(db, 'projects', projectId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Date.now(),
    });
  },

  async updateStatus(projectId: string, status: 'pending' | 'in-progress' | 'completed' | 'cancelled'): Promise<void> {
    const docRef = doc(db, 'projects', projectId);
    await updateDoc(docRef, {
      status,
      updatedAt: Date.now(),
    });
  },

  async delete(projectId: string): Promise<void> {
    const docRef = doc(db, 'projects', projectId);
    await deleteDoc(docRef);
  },
};

export const supportApi = {
  async create(userId: string, messageData: Omit<InsertSupportMessage, 'userId'>): Promise<SupportMessage> {
    const now = Date.now();
    const messageToCreate = {
      ...messageData,
      userId,
      status: 'open' as const,
      createdAt: now,
    };

    const docRef = await addDoc(collection(db, 'support_messages'), messageToCreate);
    
    return {
      id: docRef.id,
      ...messageToCreate,
    };
  },

  async getByUserId(userId: string): Promise<SupportMessage[]> {
    const q = query(
      collection(db, 'support_messages'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as SupportMessage[];
  },
};

export const contactApi = {
  async submit(formData: ContactForm): Promise<void> {
    await addDoc(collection(db, 'contact_submissions'), {
      ...formData,
      submittedAt: Date.now(),
      status: 'new',
    });
  },
};

export const portfolioApi = {
  async getAll() {
    const q = query(
      collection(db, 'portfolio'),
      orderBy('order', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  },
};

export const testimonialsApi = {
  async getAll() {
    const q = query(
      collection(db, 'testimonials'),
      orderBy('order', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  },
};
