import { MapPin, Mail, Phone } from "lucide-react";

export default function ContactForm() {
  return (
    <section className="w-full py-10 px-3">
      <div className="max-w-6xl m-auto grid md:gap-4 gap-6 md:grid-cols-8 grid-cols-4 ">
        <div className="md:col-span-4 col-span-8 flex flex-col gap-4 justify-center">
          <h1 className="text-[var(--color-primary)] text-3xl">
            Let`s talk with us
          </h1>
          <p className="text-gray-500">
            Questions, comments, or suggestions? Simply fill in the form and
            we’ll be in touch shortly.
          </p>
          <ul className="flex flex-col md:gap-3 gap-2 text-[var(--color-primary)] font-bold">
            <li className="flex gap-1">
              <MapPin /> ISTAD, Phnom Penh, Cambodia
            </li>
            <li className="flex gap-1">
              <Phone />
              +855 97 531 3579
            </li>
            <li className="flex gap-1">
              <Mail /> endora@gmail.com
            </li>
          </ul>
        </div>
        <div className="md:col-span-4 col-span-8 grid md:justify-self-end">
          <form className=" border-[0.5px] border-gray-200 md:p-8 p-3 grid grid-cols-4 gap-3 rounded-2xl bg-gray-50 dark:bg-slate-800">
            <input
              type="text"
              placeholder="First name"
              required
              className="col-span-2 border-[0.5px] p-2 rounded-md border-gray-200 bg-gray-100 dark:bg-slate-900 text-gray-900 dark:text-gray-100"
            />
            <input
              type="text"
              placeholder="Last name"
              required
              className="col-span-2 border-[0.5px] p-2 rounded-md border-gray-200 bg-gray-100 dark:bg-slate-900 text-gray-900 dark:text-gray-100"
            />
            <input
              type="email"
              placeholder="Email"
              required
              className="col-span-4 border-[0.5px] p-2 rounded-md border-gray-200 bg-gray-100 dark:bg-slate-900 text-gray-900 dark:text-gray-100"
            />
            <input
              type="number"
              placeholder="Phone Number"
              required
              className="col-span-4 border-[0.5px] p-2 rounded-md border-gray-200 bg-gray-100 dark:bg-slate-900 text-gray-900 dark:text-gray-100"
            />
            <textarea
              placeholder="Your message ..."
              required
              className="col-span-4 border-[0.5px] p-2 border-gray-200 rounded-md md:min-h-[150px] h-[100px] dark:border-slate-700 bg-gray-100 dark:bg-slate-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 "
            />
            <button
              type="submit"
              className="col-span-4 text-white bg-[var(--color-primary)] py-2 rounded-md">
              Send
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
