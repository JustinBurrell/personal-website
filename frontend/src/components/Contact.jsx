import React, { useState, useEffect } from 'react';
import AnimationWrapper from '../assets/shared/AnimationWrapper';
import SectionTitle from '../assets/ui/SectionTitle';
import emailjs from '@emailjs/browser';
import { FaLinkedin, FaGithub } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useLanguage } from '../features/language';
import { useTranslateText } from '../features/language/useTranslateText';

import { Element } from 'react-scroll';
import { portfolioService } from '../services/supabase';

const Contact = () => {
  const { translatedData, isLoading } = useLanguage();

  const getInTouchText = useTranslateText("Get in Touch");
  const contactBlurb = useTranslateText("I'd love to hear from you! Whether you have a question or just want to say hi, feel free to drop me a message.");
  const firstNameLabel = useTranslateText("First Name");
  const lastNameLabel = useTranslateText("Last Name");
  const emailLabel = useTranslateText("Email");
  const subjectLabel = useTranslateText("Subject");
  const messageLabel = useTranslateText("Message");
  const requiredText = useTranslateText("*");
  const firstNamePlaceholder = useTranslateText("Enter your first name");
  const lastNamePlaceholder = useTranslateText("Enter your last name");
  const emailPlaceholder = useTranslateText("Enter your email");
  const subjectPlaceholder = useTranslateText("Enter your subject");
  const messagePlaceholder = useTranslateText("Enter your message");
  const firstNameError = useTranslateText("Please enter your first name");
  const lastNameError = useTranslateText("Please enter your last name");
  const emailError = useTranslateText("Please enter your email");
  const subjectError = useTranslateText("Please enter a subject");
  const messageError = useTranslateText("Please enter a message");
  const formError = useTranslateText("Please fill in all required fields");
  const successMessage = useTranslateText("Message sent successfully!");
  const errorMessage = useTranslateText("Failed to send message. Please try again.");
  const sendMessageText = useTranslateText("Send Message");
  const sendingText = useTranslateText("Sending...");

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
    emailjs.init("NIv9MQw75_UFg-jlH");
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFieldErrors(prev => ({ ...prev, [name]: false }));
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
    if (hasErrors) setShowFormError(true);
    return !hasErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setShowFormError(false);
    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });

    let savedEmailId = null;

    try {
      const emailData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        subject: formData.subject,
        message: formData.content,
        ipAddress: null,
        userAgent: navigator.userAgent
      };

      const savedEmail = await portfolioService.submitEmail(emailData);
      savedEmailId = savedEmail.id;

      const templateParams = {
        from_name: `${formData.firstName} ${formData.lastName}`,
        from_email: formData.email,
        to_email: "justinburrell715@gmail.com",
        subject: formData.subject,
        message: formData.content,
        to_name: "Justin Burrell",
        reply_to: formData.email
      };

      const emailjsResponse = await emailjs.send(
        "service_h89w0oi",
        "template_56y72kh",
        templateParams,
        "NIv9MQw75_UFg-jlH"
      );

      await portfolioService.updateEmailStatus(savedEmailId, 'sent', emailjsResponse);

      setSubmitStatus({ type: 'success', message: 'Message sent successfully!' });
      setFormData({ firstName: '', lastName: '', email: '', subject: '', content: '' });
      setFieldErrors({ firstName: false, lastName: false, email: false, subject: false, content: false });
    } catch (error) {
      console.error('Error in contact form submission:', error);
      if (savedEmailId) {
        try {
          await portfolioService.updateEmailStatus(savedEmailId, 'failed', { error: error?.text || error?.message || String(error) });
        } catch (updateError) {
          console.error('Failed to update email status:', updateError);
        }
      }
      setSubmitStatus({ type: 'error', message: 'Failed to send message. Please try again.' });
    }

    setIsSubmitting(false);
  };

  if (isLoading || !translatedData || !translatedData.home) {
    return (
      <AnimationWrapper>
        <Element name="contact">
          <section id="contact" className="py-24 bg-cream-200">
            <div className="max-w-xl mx-auto px-4">
              <div className="h-12 bg-cream-300 animate-pulse rounded-2xl mb-8 w-48"></div>
              <div className="space-y-4">
                <div className="h-12 bg-cream-300 animate-pulse rounded-xl"></div>
                <div className="h-12 bg-cream-300 animate-pulse rounded-xl"></div>
              </div>
            </div>
          </section>
        </Element>
      </AnimationWrapper>
    );
  }

  const { home } = translatedData;

  const inputClasses = (hasError) =>
    `mt-1 block w-full rounded-xl border bg-cream-50 font-body px-4 py-3 focus:ring-1 focus:ring-cinnabar-500 focus:border-cinnabar-500 transition-colors ${
      hasError ? 'border-red-500' : 'border-cream-300'
    }`;

  return (
    <AnimationWrapper>
      <Element name="contact">
        <section id="contact" className="py-24 bg-cream-200">
          <div className="max-w-xl mx-auto px-4 sm:px-6">
            <SectionTitle>{getInTouchText}</SectionTitle>

            <motion.p
              className="font-body text-cream-500 mb-12"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {contactBlurb}
            </motion.p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block font-display text-sm font-medium text-cream-600 uppercase tracking-wide">
                    {firstNameLabel} <span className="text-cinnabar-500">{requiredText}</span>
                  </label>
                  <input type="text" name="firstName" id="firstName" value={formData.firstName} onChange={handleChange} placeholder={firstNamePlaceholder} className={inputClasses(fieldErrors.firstName)} />
                  {fieldErrors.firstName && <p className="mt-1 text-sm text-cinnabar-500">{firstNameError}</p>}
                </div>
                <div>
                  <label htmlFor="lastName" className="block font-display text-sm font-medium text-cream-600 uppercase tracking-wide">
                    {lastNameLabel} <span className="text-cinnabar-500">{requiredText}</span>
                  </label>
                  <input type="text" name="lastName" id="lastName" value={formData.lastName} onChange={handleChange} placeholder={lastNamePlaceholder} className={inputClasses(fieldErrors.lastName)} />
                  {fieldErrors.lastName && <p className="mt-1 text-sm text-cinnabar-500">{lastNameError}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block font-display text-sm font-medium text-cream-600 uppercase tracking-wide">
                  {emailLabel} <span className="text-cinnabar-500">{requiredText}</span>
                </label>
                <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} placeholder={emailPlaceholder} className={inputClasses(fieldErrors.email)} />
                {fieldErrors.email && <p className="mt-1 text-sm text-cinnabar-500">{emailError}</p>}
              </div>

              <div>
                <label htmlFor="subject" className="block font-display text-sm font-medium text-cream-600 uppercase tracking-wide">
                  {subjectLabel} <span className="text-cinnabar-500">{requiredText}</span>
                </label>
                <input type="text" name="subject" id="subject" value={formData.subject} onChange={handleChange} placeholder={subjectPlaceholder} className={inputClasses(fieldErrors.subject)} />
                {fieldErrors.subject && <p className="mt-1 text-sm text-cinnabar-500">{subjectError}</p>}
              </div>

              <div>
                <label htmlFor="content" className="block font-display text-sm font-medium text-cream-600 uppercase tracking-wide">
                  {messageLabel} <span className="text-cinnabar-500">{requiredText}</span>
                </label>
                <textarea name="content" id="content" rows={4} value={formData.content} onChange={handleChange} placeholder={messagePlaceholder} className={inputClasses(fieldErrors.content)} />
                {fieldErrors.content && <p className="mt-1 text-sm text-cinnabar-500">{messageError}</p>}
              </div>

              {showFormError && <p className="text-cinnabar-500 text-center font-body">{formError}</p>}
              {submitStatus.type === 'success' && <p className="text-emerald-600 text-center font-body">{successMessage}</p>}
              {submitStatus.type === 'error' && <p className="text-cinnabar-500 text-center font-body">{errorMessage}</p>}

              <div>
                <button
                  type="submit"
                  onClick={(e) => { e.preventDefault(); handleSubmit(e); }}
                  className={`w-full px-8 py-3 bg-cinnabar-500 text-white rounded-xl font-display font-semibold hover:bg-cinnabar-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cinnabar-500 transition-colors ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <span className="animate-spin h-5 w-5 mr-3 border-2 border-white rounded-full border-t-transparent"></span>
                      {sendingText}
                    </span>
                  ) : sendMessageText}
                </button>
              </div>
            </form>

            <motion.div
              className="mt-12 flex justify-center space-x-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <motion.a
                href={home.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cream-500 hover:text-cinnabar-500 transition-colors"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaLinkedin className="w-8 h-8" />
              </motion.a>
              <motion.a
                href={home.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cream-500 hover:text-cinnabar-500 transition-colors"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaGithub className="w-8 h-8" />
              </motion.a>
            </motion.div>
          </div>
        </section>
      </Element>
    </AnimationWrapper>
  );
};

export default Contact;
