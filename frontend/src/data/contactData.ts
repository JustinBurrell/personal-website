interface ContactMessage {
    firstName: string;
    lastName: string;
    email: string;
    subject: string;
    content: string;
    timestamp: string;
}

const contactData: ContactMessage[] = [];

export default contactData;
export type { ContactMessage };
