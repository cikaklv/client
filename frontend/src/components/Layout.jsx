import Navigation from './Navigation';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-100">
            <Navigation />
            <main className="py-6">
                {children}
            </main>
        </div>
    );
};

export default Layout; 