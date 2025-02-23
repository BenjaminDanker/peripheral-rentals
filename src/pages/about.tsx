// src/pages/about.tsx
import Layout from '../components/Layout';

export default function About() {
    return (
        <Layout backgroundImage='/images/about.jpg' title="About Us">
            <div className="max-w-2xl mx-auto p-8 bg-black bg-opacity-70 rounded-lg shadow-lg">
                <h1 className="text-4xl font-bold mb-4">About Us</h1>
                <p className="mb-4">
                    Welcome to our store! We are dedicated to providing you with the best products and an exceptional shopping experience.
                </p>
                <p>
                    Our team is passionate about curating high-quality items that meet your needs. Whether you're looking for the latest trends or timeless classics, we've got you covered.
                </p>
            </div>
        </Layout >
    );
}
