import { MapPin, Mail, Phone } from "lucide-react";

export default function ContactForm() {
  return (
    <section className="w-full py-10 px-3 bg-white">
      <div className="max-w-6xl m-auto grid md:gap-4 gap-6 md:grid-cols-9 grid-cols-4">
        <div className="col-span-4 flex flex-col gap-4 justify-center">
          <h1 className="text-[var(--color-primary)] text-3xl">Let's talk with us</h1>
          <p className="text-gray-500">Questions, comments, or suggestions? Simply fill in the form and we’ll be in touch shortly.</p>
          <ul className="flex flex-col md:gap-3 gap-2 text-[var(--color-primary)] font-bold">
            <li className="flex gap-1"><MapPin /> ISTAD, Phnom Penh, Cambodia</li>
            <li className="flex gap-1"><Phone/>+855 97 531 3579</li>
            <li className="flex gap-1"><Mail/> endora@gmail.com</li>
          </ul> 
        </div>
        <div className="md:col-span-1 hidden md:block"></div>
        <div className="col-span-4">
          <form action="input" className="border-[1px] border-gray-500 md:p-8 p-3 grid grid-cols-4 gap-3 rounded-2xl">
            <input type="name" placeholder="First name" required className="col-span-2 border p-2 rounded-md border-gray-500 text-gray-700 bg-gray-200"/>
            <input type="name" placeholder="Last name" required className="col-span-2 border p-2 rounded-md border-gray-500 text-gray-700 bg-gray-200"/>
            <input type="email" placeholder="Email" required className="col-span-4 border p-2 rounded-md border-gray-500 text-gray-700 bg-gray-200"/>
            <input type="number" placeholder="Phone Number" required className="col-span-4 border p-2 rounded-md border-gray-500 text-gray-700 bg-gray-200"/>
            <textarea placeholder="Your message ..." required className="col-span-4 border p-2 rounded-md md:min-h-[150px] h-[100px] border-gray-500 text-gray-700 bg-gray-200"/>
            <button type="submit" className="col-span-4 border text-white bg-[var(--color-primary)] py-2 rounded-md" >Send</button>
          </form>
        </div>
      </div>
    </section>
  )
}
