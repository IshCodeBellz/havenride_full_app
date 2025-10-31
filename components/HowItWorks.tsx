import CenteredContainer from "@/components/CenteredContainer";
import Image from "next/image";

const howItWorks = [
  {
    title: "Enter pickup and destination",
    description:
      "Tell us where you're starting and where you need to go - it only takes a moment.",
    image: "/destination.png",
  },
  {
    title: "Choose accessible vehicle",
    description:
      "Select from a range of vehicles tailored for wheelchair users and assisted travel.",
    image: "/accessible-van.png",
  },
  {
    title: "Track your ride in real-time",
    description: "Stay informed with live updates from dispatch to drop-off.",
    image: "/track-ride.png",
  },
];

const accessibilityFeatures = [
  {
    title: "Wheelchair-accessible vehicles",
    description:
      "Specialist vehicles with ramps, lifts, and secure restraints.",
    image: "/wheelchair.png",
  },
  {
    title: "Assistance-trained drivers",
    description:
      "Professionals trained in mobility support and compassionate care.",
    image: "/trained-driver.png",
  },
  {
    title: "24/7 safety and support",
    description:
      "Always-on monitoring with rapid assistance whenever you need it.",
    image: "/24-7.png",
  },
];

export default function HowItWorks() {
  return (
    <>
      {/* How It Works Section */}
      <section id="how-it-works" className="w-full bg-white py-20 lg:py-28">
        <CenteredContainer>
          <div className="mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#263238] mb-4">
              How It Works
            </h2>
            <p className="text-base sm:text-lg text-neutral-600">
              A simple three-step booking flow - no phone calls, no guesswork.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {howItWorks.map(({ title, description, image }) => (
              <div
                key={title}
                className="flex flex-col items-center text-center"
              >
                <div className="mb-6 flex items-center justify-center h-[150px]">
                  <Image
                    src={image}
                    alt={title}
                    width={150}
                    height={150}
                    className="object-contain"
                  />
                </div>
                <h3 className="text-xl font-semibold text-[#263238] mb-4">
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-neutral-600">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </CenteredContainer>
      </section>

      {/* Accessibility Section */}
      <section id="accessibility" className="w-full bg-white py-20 lg:py-28">
        <CenteredContainer>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start mb-16">
            {/* Left Column */}
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#263238] mb-6">
                Transport designed for everyone.
              </h2>
              <p className="text-base sm:text-lg text-neutral-600 max-w-2xl">
                We work with councils and care providers to make every trip safe
                and dignified.
              </p>
            </div>
            {/* Right Column */}
            <div>
              <p className="text-base sm:text-lg text-neutral-600">
                We work hand-in-hand with carers, councils, and healthcare
                providers to deliver journeys that honour independence and
                wellbeing.
              </p>
            </div>
          </div>
          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {accessibilityFeatures.map(({ title, description, image }) => (
              <div
                key={title}
                className="flex flex-col items-center text-center"
              >
                <div className="mb-6 flex items-center justify-center h-20">
                  <Image
                    src={image}
                    alt={title}
                    width={150}
                    height={150}
                    className="object-contain"
                  />
                </div>
                <h3 className="text-xl font-semibold text-[#263238] mb-3">
                  {title}
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </CenteredContainer>
      </section>
    </>
  );
}
