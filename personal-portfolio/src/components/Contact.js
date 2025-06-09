import React, { useState, useEffect } from 'react';
import AnimationWrapper from '../assets/shared/AnimationWrapper';
import emailjs from '@emailjs/browser';
import { FaLinkedin, FaGithub } from 'react-icons/fa';
import Card from '../assets/ui/Card';
import { motion } from 'framer-motion';
import { useLanguage } from '../features/language';
import Button from '../assets/ui/Button';

const Contact = () => {
  const { translatedData } = useLanguage();
  const { home } = translatedData;
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    content: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });
  const [fieldErrors, setFieldErrors] = useState({
    firstName: false,
    lastName: false,
    email: false,
    subject: false,
    content: false
  });
  const [showFormError, setShowFormError] = useState(false);

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
    // Clear error for this field when user starts typing
    setFieldErrors(prev => ({
      ...prev,
      [name]: false
    }));
    setShowFormError(false);
  };

  const validateForm = () => {
    const errors = {
      firstName: formData.firstName.trim() === '',
      lastName: formData.lastName.trim() === '',
      email: formData.email.trim() === '',
      subject: formData.subject.trim() === '',
      content: formData.content.trim() === ''
    };
    
    setFieldErrors(errors);
    const hasErrors = Object.values(errors).some(error => error);
    if (hasErrors) {
      setShowFormError(true);
    }
    return !hasErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submission attempted');
    
    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }
    setShowFormError(false);

    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });

    try {
      console.log('Sending email...');
              const templateParams = {
          from_name: `${formData.firstName} ${formData.lastName}`,
          from_email: formData.email,
          to_email: "justinburrell715@gmail.com",
          subject: formData.subject,
          message: formData.content,
          to_name: "Justin Burrell",
          reply_to: formData.email
        };

      console.log('Template params:', templateParams);

      await emailjs.send(
        "service_h89w0oi",
        "template_56y72kh",
        templateParams,
        "NIv9MQw75_UFg-jlH"
      );

      console.log('Email sent successfully');
      setSubmitStatus({
        type: 'success',
        message: 'Message sent successfully!'
      });

      // Clear form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        subject: '',
        content: ''
      });
      setFieldErrors({
        firstName: false,
        lastName: false,
        email: false,
        subject: false,
        content: false
      });

    } catch (error) {
      console.error('Failed to send email:', error);
      setSubmitStatus({
        type: 'error',
        message: 'Failed to send message. Please try again.'
      });
    }

    setIsSubmitting(false);
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
                  className="text-4xl font-bold text-center mb-8"
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ margin: "-20px" }}
                  transition={{ duration: 0.5 }}
                >
                  {translatedData.get_in_touch || "Get in Touch"}
                </motion.h2>

                <motion.p 
                  className="text-gray-600 text-center mb-12"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ margin: "-20px" }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  {translatedData.contact_description || "I'd love to hear from you! Whether you have a question or just want to say hi, feel free to drop me a message."}
                </motion.p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                        {translatedData.first_name || "First Name"} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        id="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder={translatedData.first_name_placeholder || "Enter your first name"}
                        className={`mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                          fieldErrors.firstName ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {fieldErrors.firstName && (
                        <p className="mt-1 text-sm text-red-500">
                          {translatedData.first_name_required || "Please enter your first name"}
                        </p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                        {translatedData.last_name || "Last Name"} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        id="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder={translatedData.last_name_placeholder || "Enter your last name"}
                        className={`mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                          fieldErrors.lastName ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {fieldErrors.lastName && (
                        <p className="mt-1 text-sm text-red-500">
                          {translatedData.last_name_required || "Please enter your last name"}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      {translatedData.email || "Email"} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={translatedData.email_placeholder || "Enter your email"}
                      className={`mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                        fieldErrors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {fieldErrors.email && (
                      <p className="mt-1 text-sm text-red-500">
                        {translatedData.email_required || "Please enter your email"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                      {translatedData.subject || "Subject"} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="subject"
                      id="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder={translatedData.subject_placeholder || "What is this regarding?"}
                      className={`mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                        fieldErrors.subject ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {fieldErrors.subject && (
                      <p className="mt-1 text-sm text-red-500">
                        {translatedData.subject_required || "Please enter a subject"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                      {translatedData.message || "Message"} <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="content"
                      id="content"
                      rows={4}
                      value={formData.content}
                      onChange={handleChange}
                      placeholder={translatedData.message_placeholder || "Enter your message"}
                      className={`mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                        fieldErrors.content ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {fieldErrors.content && (
                      <p className="mt-1 text-sm text-red-500">
                        {translatedData.message_required || "Please enter your message"}
                      </p>
                    )}
                  </div>

                  {showFormError && (
                    <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
                      {translatedData.fill_all_fields || "Please fill out all required fields"}
                    </div>
                  )}

                  {submitStatus.message && (
                    <div className={`text-sm text-center ${submitStatus.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                      {submitStatus.message}
                    </div>
                  )}

                  <div className="flex justify-center">
                    <button
                      type="submit"
                      onClick={(e) => {
                        e.preventDefault();
                        handleSubmit(e);
                      }}
                      className={`w-full md:w-auto px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                        isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <span className="animate-spin h-5 w-5 mr-3 border-2 border-white rounded-full border-t-transparent"></span>
                          {translatedData.sending || "Sending..."}
                        </span>
                      ) : (
                        translatedData.send_message || "Send Message"
                      )}
                    </button>
                  </div>
                </form>

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