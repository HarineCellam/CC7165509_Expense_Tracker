import { useNavigate } from 'react-router-dom';

function Home(){
    const navigate = useNavigate();
    return(
        <div className="relative h-[50vh] w-full bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/home-bg-img.jpg')" }}>
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-center text-white px-6">
                    <h2 className="text-4xl font-bold mb-4">Welcome to Expenz</h2>
                    <p className="text-lg">Where you can track your spending and take control of your finances.</p>
                </div>
            </div>
        </div>
    );
}

export default Home;