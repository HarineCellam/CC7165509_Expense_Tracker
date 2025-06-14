import { useNavigate } from 'react-router-dom';

function Home(){
    const navigate = useNavigate();
    return(
        <div>
        <div className="relative h-[50vh] w-full bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/home-bg-img.jpg')" }}>
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-center text-white px-6">
                    <h2 className="text-4xl font-bold mb-4">Welcome to Expenz</h2>
                    <p className="text-lg">Where you can track your spending and take control of your finances.</p>
                </div>
            </div>
        </div>

      <section id='about' className="py-12 px-8 bg-gray-100 dark:bg-gray-800">
        <h2 className="text-3xl font-bold text-center mb-6">About Us</h2>
        <p className="text-lg text-center max-w-4xl mx-auto">
          Expenz is designed to help individuals manage their finances seamlessly, track expenses, and gain insights into spending habits.
        </p>
      </section>

      <section id='services' className="py-12 px-8 bg-white dark:bg-gray-900">
        <h2 className="text-3xl font-bold text-center mb-6">Our Services</h2>
        <ul className="max-w-4xl mx-auto text-lg">
          <li className="mb-4">✔ Expense Tracking</li>
          <li className="mb-4">✔ Budget Planning</li>
          <li className="mb-4">✔ Financial Reports</li>
        </ul>
      </section>

      <section id='contact' className="py-12 px-8 bg-gray-100 dark:bg-gray-800">
        <h2 className="text-3xl font-bold text-center mb-6">Contact Us</h2>
        <p className="text-lg text-center max-w-4xl mx-auto">
          Have questions? Reach out via email at <span className="font-semibold">support@expenz.com</span> or call us at <span className="font-semibold">+91 123 456 7890</span>.
        </p>
      </section>
      </div>
    );
}

export default Home;