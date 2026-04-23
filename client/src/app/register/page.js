import RegisterForm from './RegisterForm';

export const metadata = {
  title: 'Join the Creative Elite',
  description: 'Register as a creator on Dapnix.creators. Build your professional portfolio and start receiving direct bookings.',
};

export default function RegisterPage() {
    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background Image with Overlay */}
            <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 hover:scale-105"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1605379399642-870262d3d051?w=1600')" }}
            >
                <div className="absolute inset-0 bg-black/60 backdrop-grayscale-[0.2]" />
            </div>

            {/* Logo Overlay */}
            <div className="absolute top-10 left-10 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                </div>
                <span className="text-white text-xl font-bold tracking-tighter italic">YourLogo</span>
            </div>

            {/* Corner Decorative Elements */}
            <div className="absolute bottom-10 right-10 flex gap-10">
                <div className="text-[10px] text-white/30 uppercase font-black tracking-widest">Dapnix.Creators &copy; 2026</div>
            </div>

            {/* Content Portal */}
            <div className="relative z-10 w-full px-6 flex justify-center">
                <RegisterForm />
            </div>
        </div>
    );
}
