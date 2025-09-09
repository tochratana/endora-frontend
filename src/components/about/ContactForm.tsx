import { MapPin, Mail, Phone } from "lucide-react";

export default function ContactForm() {
  return (
    <section className="w-full py-10 px-3">
      <div className="max-w-6xl m-auto grid md:gap-4 gap-6 md:grid-cols-8 grid-cols-4 ">
        <div className="md:col-span-4 col-span-8 flex flex-col gap-4 justify-center">
          <h1 className="text-[var(--color-primary)] text-3xl">Let`s talk with us</h1>
          <p className="text-gray-500">Questions, comments, or suggestions? Simply fill in the form and we’ll be in touch shortly.</p>
          <ul className="flex flex-col md:gap-3 gap-2 text-[var(--color-primary)] font-bold">
            <li className="flex gap-1"><MapPin /> ISTAD, Phnom Penh, Cambodia</li>
            <li className="flex gap-1"><Phone/>+855 97 531 3579</li>
            <li className="flex gap-1"><Mail/> endora@gmail.com</li>
          </ul> 
        </div>
        <div className="md:col-span-4 col-span-8 grid md:justify-self-end">
          <form action="input" className="border-[1px] border-gray-500 md:p-8 p-3 grid grid-cols-4 gap-3 rounded-2xl">
            <input type="name" placeholder="First name" required className="col-span-2 border p-2 rounded-md border-gray-500 text-gray-800 dark:text-gray-200 bg-gray-300 dark:bg-gray-900"/>
            <input type="name" placeholder="Last name" required className="col-span-2 border p-2 rounded-md border-gray-500 text-gray-800 dark:text-gray-200 bg-gray-300 dark:bg-gray-900"/>
            <input type="email" placeholder="Email" required className="col-span-4 border p-2 rounded-md border-gray-500 text-gray-800 dark:text-gray-200 bg-gray-300 dark:bg-gray-900"/>
            <input type="number" placeholder="Phone Number" required className="col-span-4 border p-2 rounded-md border-gray-500 text-gray-800 dark:text-gray-200 bg-gray-300 dark:bg-gray-900"/>
            <textarea placeholder="Your message ..." required className="col-span-4 border p-2 rounded-md md:min-h-[150px] h-[100px] border-gray-500 text-gray-200 dark:text-gray-800 bg-gray-300 dark:bg-gray-900"/>
            <button type="submit" className="col-span-4 border text-white bg-[var(--color-primary)] py-2 rounded-md" >Send</button>
          </form>
        </div>
      </div>
    </section>
  )
}
