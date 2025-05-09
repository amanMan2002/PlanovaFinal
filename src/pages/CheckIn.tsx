import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { QRCodeSVG } from 'qrcode.react';
import CryptoJS from 'crypto-js';
import { Shield, CreditCard, Smartphone } from 'lucide-react';

const CheckIn = () => {
  const { venueId } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    guests: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const generateOtp = async () => {
    const newOtp = Math.floor(10000 + Math.random() * 90000).toString();
    setGeneratedOtp(newOtp);
    setShowOtpInput(true);
    toast.success(`Your OTP is: ${newOtp}`);
  };

  const generateTransactionId = () => {
    return 'TXN' + Date.now().toString(36).toUpperCase() + 
           Math.random().toString(36).substring(2, 15).toUpperCase();
  };

  const handlePaymentMethodSelect = (method: string) => {
    setPaymentMethod(method);
    generateOtp();
  };

  const verifyOtp = () => {
    if (otp === generatedOtp) {
      const newTransactionId = generateTransactionId();
      setTransactionId(newTransactionId);
      setShowPaymentSuccess(true);
      
      const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      bookings.push({
        id: newTransactionId,
        venueId,
        ...formData,
        status: 'pending',
        paymentDetails: {
          amount: 59000,
          transactionId: newTransactionId,
          status: 'pending'
        }
      });
      localStorage.setItem('bookings', JSON.stringify(bookings));
      
      setTimeout(() => {
        navigate('/bookings');
        toast.success('Booking submitted for confirmation!');
      }, 2000);
    } else {
      toast.error('Invalid OTP. Please try again.');
    }
  };

  const encryptOtp = (otp: string) => {
    const secretKey = 'planova-secret-key';
    return CryptoJS.AES.encrypt(otp, secretKey).toString();
  };

  if (showPaymentSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg text-center max-w-md w-full">
          <div className="mb-4 text-green-500">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-green-500 mb-4">Payment Submitted</h2>
          <p className="text-gray-600 mb-4">Transaction ID: {transactionId}</p>
          <p className="text-gray-500">Your booking will be confirmed shortly...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {step === 1 ? (
        <>
          <h1 className="text-3xl font-bold mb-8">Enter Your Details</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                required
                className="w-full border rounded-md p-2"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                className="w-full border rounded-md p-2"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                required
                className="w-full border rounded-md p-2"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Date
              </label>
              <input
                type="date"
                name="date"
                required
                className="w-full border rounded-md p-2"
                value={formData.date}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Guests
              </label>
              <input
                type="number"
                name="guests"
                required
                className="w-full border rounded-md p-2"
                value={formData.guests}
                onChange={handleInputChange}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-pink-500 text-white py-3 rounded-md hover:bg-pink-600"
            >
              Proceed to Payment
            </button>
          </form>
        </>
      ) : (
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Complete Payment</h2>
                <p className="text-gray-600">Secure payment powered by Planova</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Amount to pay</p>
                <p className="text-2xl font-bold">₹59,000</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Shield className="text-green-500" size={20} />
              <span className="text-sm text-gray-600">100% secure payments</span>
            </div>

            {!paymentMethod ? (
              <div className="space-y-4">
                <h3 className="font-semibold mb-4">Select Payment Method</h3>
                <button
                  onClick={() => handlePaymentMethodSelect('card')}
                  className="w-full bg-white border rounded-lg p-4 hover:bg-gray-50 flex items-center space-x-3"
                >
                  <CreditCard className="text-pink-500" size={24} />
                  <div className="flex-1 text-left">
                    <p className="font-medium">Credit / Debit Card</p>
                    <p className="text-sm text-gray-500">All major cards accepted</p>
                  </div>
                </button>
                <button
                  onClick={() => handlePaymentMethodSelect('upi')}
                  className="w-full bg-white border rounded-lg p-4 hover:bg-gray-50 flex items-center space-x-3"
                >
                  <Smartphone className="text-pink-500" size={24} />
                  <div className="flex-1 text-left">
                    <p className="font-medium">UPI Payment</p>
                    <p className="text-sm text-gray-500">Pay using UPI app</p>
                  </div>
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {paymentMethod === 'card' ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Number
                      </label>
                      <input
                        type="text"
                        className="w-full border rounded-md p-2"
                        placeholder="1234 5678 9012 3456"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          className="w-full border rounded-md p-2"
                          placeholder="MM/YY"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CVV
                        </label>
                        <input
                          type="text"
                          className="w-full border rounded-md p-2"
                          placeholder="123"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-8">
                    <div className="text-center">
                      <h3 className="font-semibold mb-4">Scan to Pay</h3>
                      <div className="bg-white p-4 rounded-lg shadow-md inline-block">
                        <QRCodeSVG
                          value={`upi://pay?pa=planova@upi&pn=Planova&am=59000&cu=INR&tn=${venueId}`}
                          size={200}
                          className="mx-auto"
                        />
                        <p className="mt-2 text-sm text-gray-600">Amount: ₹59,000</p>
                      </div>
                    </div>

                    <div className="text-center">
                      <h3 className="font-semibold mb-4">Scan for OTP</h3>
                      <div className="bg-white p-4 rounded-lg shadow-md inline-block">
                        <QRCodeSVG
                          value={encryptOtp(generatedOtp)}
                          size={200}
                          className="mx-auto"
                        />
                        <p className="mt-2 text-sm text-gray-600">Generated OTP: {generatedOtp}</p>
                      </div>
                    </div>
                  </div>
                )}

                {showOtpInput && (
                  <div className="mt-8 max-w-sm mx-auto">
                    <p className="text-center mb-4 text-gray-600">
                      Enter the OTP shown above to complete your payment
                    </p>
                    <input
                      type="text"
                      maxLength={5}
                      placeholder="Enter OTP"
                      className="w-full border rounded-md p-3 text-center text-lg tracking-wider"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                    <button
                      onClick={verifyOtp}
                      className="w-full mt-4 bg-pink-500 text-white py-3 rounded-md hover:bg-pink-600"
                    >
                      Verify & Complete Payment
                    </button>
                  </div>
                )}

                <button
                  onClick={() => {
                    setPaymentMethod('');
                    setShowOtpInput(false);
                    setOtp('');
                  }}
                  className="w-full text-gray-600 hover:text-gray-800"
                >
                  Choose Another Payment Method
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckIn;