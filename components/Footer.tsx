import Link from "next/link";
import CenteredContainer from "@/components/CenteredContainer";

export default function Footer() {
  return (
    <footer className="w-full bg-white">
      {/* Become a Driver CTA Section */}
      <div className="w-full bg-[#00796B] py-16">
        <CenteredContainer>
          <div className="text-center text-white">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Drive with HavenRide
            </h2>
            <p className="text-lg sm:text-xl mb-8 opacity-90">
              Join our team of compassionate drivers making a difference
            </p>
            <Link
              href="/driver-signup"
              className="inline-block bg-white text-[#00796B] px-10 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
            >
              Become a Driver
            </Link>
          </div>
        </CenteredContainer>
      </div>

      {/* Footer Links */}
      <div id="support" className="w-full border-t py-12">
        <CenteredContainer>
          <div className="flex flex-col gap-6 items-center justify-center text-center">
            <div className="flex flex-wrap gap-4 text-sm text-neutral-600 justify-center">
              <Link href="#" className="hover:text-[#00796B]">
                Support
              </Link>
              <Link href="#" className="hover:text-[#00796B]">
                Privacy
              </Link>
              <Link href="#" className="hover:text-[#00796B]">
                Terms
              </Link>
              <Link href="#" className="hover:text-[#00796B]">
                Accessibility
              </Link>
            </div>
            <p className="text-sm text-neutral-500">admin@havenride.co.uk</p>
          </div>
        </CenteredContainer>
      </div>
    </footer>
  );
}
