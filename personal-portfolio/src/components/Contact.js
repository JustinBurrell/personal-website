import React, { useState, useEffect } from 'react';
import AnimationWrapper from '../assets/shared/AnimationWrapper';
import portfolioData from '../data/portfolioData.ts';
import contactData, { ContactMessage } from '../data/contactData.ts';
import emailjs from '@emailjs/browser';
import { FaLinkedin, FaGithub } from 'react-icons/fa';
import Card from '../assets/ui/Card';
import { motion } from 'framer-motion';

const Contact = () => {
  const { home } = portfolioData;
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    content: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });
  const [formErrors, setFormErrors] = useState(false);

  useEffect(() => {
    // Initialize EmailJS
    emailjs.init("NIv9MQw75_UFg-jlH");
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error message when user starts typing
    setFormErrors(false);
  };

  const validateForm = () => {
    const { firstName, lastName, email, subject, content } = formData;
    return firstName.trim() !== '' && 
           lastName.trim() !== '' && 
           email.trim() !== '' && 
           subject.trim() !== '' && 
           content.trim() !== '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setFormErrors(true);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });
    setFormErrors(false);

    const messageData = {
      ...formData,
      timestamp: new Date().toISOString()
    };

    try {
      // Add to contactData
      contactData.push(messageData);

      // Send email using EmailJS
      const templateParams = {
        from_name: `${formData.firstName} ${formData.lastName}`,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.content,
        to_email: 'justinburrell715@gmail.com'
      };

      await emailjs.send(
        'service_h89w0oi',
        'template_56y72kh',
        templateParams
      );

      setSubmitStatus({
        type: 'success',
        message: 'Message sent successfully!'
      });
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        subject: '',
        content: ''
      });
    } catch (error) {
      console.error('Error sending message:', error);
      setSubmitStatus({
        type: 'error',
        message: 'Failed to send message. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <AnimationWrapper>
      <section id="contact" className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col space-y-16 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ margin: "-20px" }}
              transition={{ duration: 0.5 }}
            >
              <Card className="p-8">
                <motion.h2 
                  className="text-4xl font-bold text-center mb-6"
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ margin: "-20px" }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  Get in Touch
                </motion.h2>
                <motion.p 
                  className="text-lg text-gray-600 text-center mb-12"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ margin: "-20px" }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  Thank you for checking out my website! I would love to connect. Feel free to connect with me on LinkedIn, check out my Github, or send me an email using this form!
                </motion.p>
                
                <motion.form 
                  onSubmit={handleSubmit} 
                  className="max-w-4xl mx-auto space-y-6"
                  variants={formAnimation}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ margin: "-20px" }}
                >
                  {formErrors && (
                    <motion.div 
                      className="text-red-500 text-center font-medium"
                      variants={itemAnimation}
                    >
                      Please fill out all fields before submitting.
                    </motion.div>
                  )}

                  <motion.div 
                    className="grid md:grid-cols-2 gap-6"
                    variants={itemAnimation}
                  >
                    <motion.div variants={itemAnimation}>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </motion.div>
                    <motion.div variants={itemAnimation}>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </motion.div>
                  </motion.div>

                  <motion.div variants={itemAnimation}>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </motion.div>

                  <motion.div variants={itemAnimation}>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </motion.div>

                  <motion.div variants={itemAnimation}>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="content"
                      name="content"
                      value={formData.content}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </motion.div>

                  {submitStatus.message && (
                    <motion.div 
                      className={`text-center p-3 rounded-md ${
                        submitStatus.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {submitStatus.message}
                    </motion.div>
                  )}

                  <motion.div 
                    className="flex justify-center"
                    variants={itemAnimation}
                  >
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </motion.button>
                  </motion.div>
                </motion.form>

                <motion.div 
                  className="mt-12 flex justify-center space-x-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ margin: "-20px" }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <motion.a
                    href={home.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaLinkedin className="w-8 h-8" />
                  </motion.a>
                  <motion.a
                    href={home.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaGithub className="w-8 h-8" />
                  </motion.a>
                </motion.div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default Contact;