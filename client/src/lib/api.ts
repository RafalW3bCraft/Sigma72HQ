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
  deleteField,
  onSnapshot,
} from 'firebase/firestore';
import { db } from './firebase';
import {
  InsertProject,
  Project,
  InsertSupportMessage,
  SupportMessage,
  ContactForm,
  ContactSubmission,
  UserProfile,
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

  async getAll(): Promise<Project[]> {
    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<Project, 'id'>),
    }));
  },

  subscribeAll(
    callback: (projects: Project[]) => void,
    onError?: (error: Error) => void,
  ) {
    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));

    return onSnapshot(
      q,
      (snapshot) => {
        const next = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<Project, 'id'>),
        }));
        callback(next);
      },
      (error) => {
        console.error('[projectsApi.subscribeAll]', error);
        onError?.(error);
      },
    );
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
      updatedAt: now,
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

  async getAll(): Promise<SupportMessage[]> {
    const q = query(collection(db, 'support_messages'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<SupportMessage, 'id'>),
    }));
  },

  async updateStatus(
    messageId: string,
    status: 'open' | 'in-progress' | 'resolved',
  ): Promise<void> {
    const docRef = doc(db, 'support_messages', messageId);
    await updateDoc(docRef, {
      status,
      updatedAt: Date.now(),
    });
  },

  subscribeAll(
    callback: (messages: SupportMessage[]) => void,
    onError?: (error: Error) => void,
  ) {
    const q = query(collection(db, 'support_messages'), orderBy('createdAt', 'desc'));
    return onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<SupportMessage, 'id'>),
        }));
        callback(data);
      },
      (error) => {
        console.error('[supportApi.subscribeAll]', error);
        onError?.(error);
      },
    );
  },
};

export const contactApi = {
  async submit(formData: ContactForm): Promise<void> {
    await addDoc(collection(db, 'contact_submissions'), {
      ...formData,
      createdAt: Date.now(),
      submittedAt: Date.now(),
      status: 'new',
    });
  },

  async getAll(): Promise<ContactSubmission[]> {
    const q = query(collection(db, 'contact_submissions'), orderBy('submittedAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((docSnap) => {
      const data = docSnap.data() as any;
      return {
        id: docSnap.id,
        name: data.name,
        email: data.email,
        message: data.message,
        status: data.status ?? 'new',
        createdAt: data.createdAt ?? data.submittedAt ?? Date.now(),
        respondedAt: data.respondedAt ?? undefined,
      } as ContactSubmission;
    });
  },

  async updateStatus(
    submissionId: string,
    status: 'new' | 'read' | 'responded',
  ): Promise<void> {
    const docRef = doc(db, 'contact_submissions', submissionId);
    await updateDoc(docRef, {
      status,
      respondedAt: status === 'responded' ? Date.now() : deleteField(),
    });
  },

  subscribeAll(
    callback: (submissions: ContactSubmission[]) => void,
    onError?: (error: Error) => void,
  ) {
    const q = query(collection(db, 'contact_submissions'), orderBy('submittedAt', 'desc'));
    return onSnapshot(
      q,
      (snapshot) => {
        const submissions = snapshot.docs.map((docSnap) => {
          const data = docSnap.data() as any;
          return {
            id: docSnap.id,
            name: data.name,
            email: data.email,
            message: data.message,
            status: data.status ?? 'new',
            createdAt: data.createdAt ?? data.submittedAt ?? Date.now(),
            respondedAt: data.respondedAt ?? undefined,
          } as ContactSubmission;
        });
        callback(submissions);
      },
      (error) => {
        console.error('[contactApi.subscribeAll]', error);
        onError?.(error);
      },
    );
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

export const usersApi = {
  async getAll(): Promise<UserProfile[]> {
    const snapshot = await getDocs(collection(db, 'users'));
    return snapshot.docs.map((docSnap) => ({
      uid: docSnap.id,
      ...(docSnap.data() as Omit<UserProfile, 'uid'>),
    }));
  },

  subscribeAll(
    callback: (users: UserProfile[]) => void,
    onError?: (error: Error) => void,
  ) {
    const usersCollection = collection(db, 'users');
    return onSnapshot(
      usersCollection,
      (snapshot) => {
        const users = snapshot.docs.map((docSnap) => ({
          uid: docSnap.id,
          ...(docSnap.data() as Omit<UserProfile, 'uid'>),
        }));
        callback(users);
      },
      (error) => {
        console.error('[usersApi.subscribeAll]', error);
        onError?.(error);
      },
    );
  },
};
