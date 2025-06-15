import emailjs from "emailjs-com";
import { motion } from "framer-motion";
import { useRef } from "react";
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();
    const formRef = useRef(null);

    const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm(
        "service_i98ozws",
        "template_0h92pkn",
        e.target,
        "lSCnmAhkXcyxWspmR"
    ).then(
        (result) => {
            alert("Message sent successfully!");
            console.log(result.text);
            formRef.current.reset();
        },
        (error) => {
            alert("Failed to send message. Please try again.");
            console.error(error.text);
          }
      );
    };
    return (
        <div className="dark:bg-gray-900 bg-gray-100 text-gray-800 dark:text-gray-300 min-h-screen">

            {/* Home Section */}
            <div className="relative h-[50vh] w-full bg-cover bg-center bg-no-repeat dark:bg-gray-900" style={{ backgroundImage: "url('/home-bg-img.jpg')" }}>
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="text-center text-white px-6">
                        <h2 className="text-4xl font-bold mb-4">Welcome to Expenz</h2>
                        <p className="text-lg">Where you can track your spending and take control of your finances.</p>
                        <div className="text-center mt-8">
                            <button className="bg-gradient-to-r from-blue-600 to-purple-500 dark:from-gray-700 dark:to-gray-900 hover:from-blue-700 hover:to-purple-600 text-white py-3 px-6 rounded-lg text-lg transition-all duration-300" onClick={() => navigate("/signup")}>
                                Get Started
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* About Section */}
            <section id="about" className="py-12 px-8 bg-gray-100 dark:bg-gray-800">
                <h2 className="text-4xl font-bold text-center mb-8">About Us</h2>
                <p className="text-lg text-center max-w-4xl mx-auto">
                    Expenz is designed to help individuals manage their finances seamlessly, track expenses, and gain insights into spending habits.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center text-white mt-12">
                    <motion.div className="bg-blue-500 dark:bg-gray-700 p-6 rounded-lg shadow-lg border border-gray-700 hover:shadow-xl hover:scale-105 transition-transform duration-300">
                        <h3 className="text-2xl font-bold">Budget Tracking</h3>
                        <p className="mt-2">Easily set and monitor your budget with real-time updates.</p>
                    </motion.div>

                    <motion.div className="bg-green-500 dark:bg-gray-700 p-6 rounded-lg shadow-lg border border-gray-700 hover:shadow-xl hover:scale-105 transition-transform duration-300">
                        <h3 className="text-2xl font-bold">Spending Insights</h3>
                        <p className="mt-2">Analyze your spending patterns to make smarter financial decisions.</p>
                    </motion.div>

                    <motion.div className="bg-purple-500 dark:bg-gray-700 p-6 rounded-lg shadow-lg border border-gray-700 hover:shadow-xl hover:scale-105 transition-transform duration-300">
                        <h3 className="text-2xl font-bold">Detailed Reports</h3>
                        <p className="mt-2">Generate reports to track expenses and forecast future budgets.</p>
                    </motion.div>
                </div>
            </section>

            {/* Services Section */}
            <section id="services" className="py-16 px-8 bg-white dark:bg-gray-900">
                <h2 className="text-4xl font-bold text-center mb-8">Our Services</h2>
                <div className="max-w-4xl mx-auto space-y-10">
                    <motion.div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700" whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                        <h3 className="text-2xl font-bold text-blue-600">✔ Expense Tracking</h3>
                        <p className="mt-4 text-lg">Keep a <strong>detailed log</strong> of your daily expenses effortlessly. Categorize your spending, view real-time updates, and identify areas where you can <strong>cut unnecessary costs</strong>. Our intuitive system helps you stay aware of your financial habits and ensures you remain in control.</p>
                    </motion.div>
                    <motion.div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700" whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                        <h3 className="text-2xl font-bold text-green-600">✔ Budget Planning</h3>
                        <p className="mt-4 text-lg">Set <strong>custom budgets</strong> that align with your financial goals. Track your income and spending trends to optimize savings and ensure a balanced approach to finances. Our platform provides <strong>intelligent recommendations</strong> to help you stay within budget while still enjoying life.</p>
                    </motion.div>
                    <motion.div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700" whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                        <h3 className="text-2xl font-bold text-purple-600">✔ Financial Reports</h3>
                        <p className="mt-4 text-lg">Generate <strong>detailed financial insights</strong> to understand your spending patterns better. Our system automatically compiles visual reports that display your financial progress over time. Use these reports to make informed decisions and plan for a <strong>secure financial future</strong>.</p>
                    </motion.div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-12 px-8 bg-gray-100 dark:bg-gray-800 flex justify-center">
                <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-xl">
                    <h2 className="text-3xl font-bold text-center mb-6">Contact Us</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 text-gray-700 dark:text-gray-300">
                        <div>
                            <h3 className="text-xl font-semibold">📧 Email</h3>
                            <p>harinecellamcc7165509@gmail.com</p>
                            <h3 className="text-xl font-semibold mt-4">📞 Contact Info</h3>
                            <p>+91 843 853 1777</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold">📍 Address</h3>
                            <p>A75, 2nd Avenue, Anna Nagar, Chennai - 600040, Tamil Nadu</p>
                            <h3 className="text-xl font-semibold mt-4">🕒 Business Hours</h3>
                            <p>Mon-Fri: 08:00 - 19:00</p>
                        </div>
                    </div>

                    <form ref={formRef} onSubmit={sendEmail} className="space-y-4">
                        <input type="text" name="name" className="w-full p-3 rounded-md border" placeholder="Your Name" required />
                        <input type="tel" name="phone" className="w-full p-3 rounded-md border" placeholder="Your Phone" required />
                        <input type="email" name="email" className="w-full p-3 rounded-md border" placeholder="Your Email" required />
                        <textarea name="message" className="w-full p-3 rounded-md border" placeholder="Your Message" rows="3" required></textarea>
                        <div className="text-center">
                            <button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-500 dark:from-gray-700 dark:to-gray-900 hover:from-blue-700 hover:to-purple-600 text-white py-3 px-6 rounded-lg text-lg transition-all duration-300">Send Message</button>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    );
}

export default Home;