"use client";
import { motion } from 'framer-motion';
import MemberCard from './MemberCard';

const graduates = [
  {
    name: "Amos Daniel Eniola",
    // nickname: "The Visionary",
    image: "/daniel.jpg",
    dob: "July 26th",
    unit: "Prayer team, Sunday School",
    department: "Pure and Applied Chemistry",
    moment: "Sunday school period",
    status: "Single & Purpose-driven",
    skill: "Realtor",
    hobbies: "Cooking and Singing",
    quote: "Ps.34.9 - Oh, fear the Lord, you His saints! There is no want to those who fear Him.",
    oneWord: "Driving",
    origin: "Osun State",
    whatsapp: "2348000000000",
    email: "danielamos641@gmail.com"
    // portfolio: "https://tijesu.me"
  },
  {
    name: "Adebayo Precious Adewunmi",
    // nickname: "The Visionary",
    image: "/precious.jpg",
    dob: "March 9th",
    unit: "Prayer team, Hospitality",
    department: "nil",
    moment: "Altar Contact",
    status: "Single & Purpose-driven",
    skill: "Catering",
    hobbies: "Studying, Traveling",
    quote: "Jeremiah 29:11",
    oneWord: "I am nothing without Christ",
    origin: "Oyo State",
    whatsapp: "2348000000000",
    email: "preciousadebayo51@gmail.com"
    // portfolio: "https://tijesu.me"
  },
  {
    name: "David Praise Oluwasegun",
    // nickname: "The Visionary",
    image: "/praise.jpg",
    dob: "February 23rd",
    unit: "Choit Unit",
    department: "Agricultural Economics",
    moment: "Worker's in training and Sunday school",
    status: "Single & Purpose-driven",
    skill: "Graphics design, Content writing",
    hobbies: "Staying alone, Adobe Suite(s)",
    quote: "2Tim.2.15 - Study to shew thyself approved unto God, a workman that needeth not to be ashamed, rightly dividing the word of truth.",
    oneWord: "Well-done",
    origin: "Oyo State",
    whatsapp: "2348000000000",
    email: "talk2praisedavid03@gmail.com"
    // portfolio: "https://tijesu.me"
  },
  {
    name: "Badmus Olakunle",
    // nickname: "The Visionary",
    image: "/badmus.jpg",
    dob: "January 10th",
    unit: "Non-Worker",
    department: "English and Literary Studies",
    moment: "Praise and Worship session",
    status: "Single & Purpose-driven",
    skill: "Clothing brand",
    hobbies: "Eating, surfing the wen and seeing movies",
    quote: "Philippians.4.13 - I can do all things through Christ who strengthens me.",
    oneWord: "Focused",
    origin: "Oyo State",
    whatsapp: "2348000000000",
    email: "badmusolakunle493@gmail.com"
    // portfolio: "https://tijesu.me"
  },
  {
    name: "Bolanle Odunola Precious",
    // nickname: "The Visionary",
    image: "/bolanle.jpg",
    dob: "December 31st",
    unit: "Non-worker",
    department: "Philosophy",
    moment: "Praise and worship session",
    status: "In a relationship",
    skill: "Hair Stylist",
    hobbies: "Watching movies",
    quote: "Always hope for the best but prepare for the worst.",
    oneWord: "introvert",
    origin: "Oyo State",
    whatsapp: "2348000000000",
    email: "bolanleodun78@gmail.com"
    // portfolio: "https://tijesu.me"
  },
  {
    name: "Olorunfunmi Favour Temitayo",
    // nickname: "The Visionary",
    image: "/favour.jpeg",
    dob: "July 4th",
    unit: "Choir, Sanctuary Keeper, Evangelism",
    department: "Accounting",
    moment: "Thanksgiving",
    status: "Single & Purpose-driven",
    skill: "Hair stylist and Wig making",
    hobbies: "Singing and always finding a way to encourage people",
    quote: "Galatians.2.20 - i am crucified with Christ: nevertheless I live, yet not I, but Christ liveth in me: and the life which I now live in the flesh I live by the faith of the son of God, who loved me, and gave himself for me.",
    oneWord: "I'm a gentle and loving person",
    origin: "Ogun State",
    whatsapp: "2348000000000",
    email: "olorunfunmifavour@gmail.com"
    // portfolio: "https://tijesu.me"
  }, {
    name: "Egbedeyi Tomiwa Esther",
    // nickname: "The Visionary",
    image: "/tomiwa.jpeg",
    dob: "October 11th",
    unit: "Choir",
    department: "Pure and Applied Chemistry",
    moment: "First Sundays",
    status: "Single & Purpose-driven",
    skill: "Fashion designing",
    hobbies: "Fashion designing, Photography",
    quote: "Ephesians 3:20.",
    oneWord: "Visionary",
    origin: "Oyo State",
    whatsapp: "2348000000000",
    email: "oluwatomiwaegbedeyi@gmail.com"
    // portfolio: "https://tijesu.me"
  },
  {
    name: "Adeyemo Goodness Adeyemi",
    // nickname: "The Visionary",
    image: "/adeyemo.jpeg",
    dob: "June 11th",
    unit: "Non-worker",
    department: "SLT",
    moment: "Praise and Worship session",
    status: "In a relationship",
    skill: "Nil",
    hobbies: "Drumming",
    quote: "Philippians.4.13 - I can do all things through Christ who strengthens me.",
    oneWord: "Resilient",
    origin: "Oyo State",
    whatsapp: "2348000000000",
    email: "adeyemogoodness825@gmail.com"
    // portfolio: "https://tijesu.me"
  },
  {
    name: "Alamu Victoria Temitope",
    // nickname: "The Visionary",
    image: "/victoria.jpg",
    dob: "Jabuary 07th",
    unit: "Non-worker",
    department: "Science Laboratory Technology SLT",
    moment: "Sunday school, praise and worship",
    status: "In a relationship",
    skill: "Fashion designer and food stuff selling",
    hobbies: "Reading novel and listening to music",
    quote: "Life is all about give and take but it is better to give than to recieve because a giver never lack. Psalm 23:1.",
    oneWord: "Gentle",
    origin: "Oyo State",
    whatsapp: "2348000000000",
    email: "alamuvictoria2@gmail.com"
    // portfolio: "https://tijesu.me"
  },
  {
    name: "Adigun Mary Ayomide",
    // nickname: "The Visionary",
    image: "/mary.jpg",
    dob: "March 10th",
    unit: "Choir, Drama",
    department: "Accounting",
    moment: "Praise, worship and drama ministration",
    status: "Single & Purpose-driven",
    skill: "Catering and decoration service with gele tying",
    hobbies: "Cooking and Dancing",
    quote: "He that dwells in the secret place of the most high, shall abide under the shadow of the Almighty.",
    oneWord: "I'm a disciplined lady",
    origin: "Oyo State",
    whatsapp: "2348000000000",
    email: "adigunmary494@gmail.com"
    // portfolio: "https://tijesu.me"
  },
  {
    name: "Aina Ifeoluwa",
    // nickname: "The Visionary",
    image: "/ifeoluwa.jpeg",
    dob: "May 21st",
    unit: "Ushering",
    department: "History",
    moment: "Choir ministration",
    status: "Single & Purpose-driven",
    skill: "Entrepreneurship",
    hobbies: "Watching film and playing games",
    quote: "Bless the lord oh my soul, Bless His only name.",
    oneWord: "I love to keep my own company than go out",
    origin: "Ekiti State",
    whatsapp: "2348000000000",
    email: "ifeoluwaaina08@gmail.com"
    // portfolio: "https://tijesu.me"
  },
  {
    name: "Asher Adewunmi Olabode",
    // nickname: "The Visionary",
    image: "/asher.jpg",
    dob: "November 12th",
    unit: "Sanctuary keepers, Evangelism, Prayer team, Hospitality",
    department: "Urban and Regional Planning",
    moment: "Going for outreach and evangelism",
    status: "Single & Purpose-driven",
    skill: "Import and export / Web 3",
    hobbies: "Sleeping and Reading.",
    quote: "Deuteronomy.33.24 -  May Asher be blessed above other sons; may he be esteemed by his brothers; may he bathe his feet in olive oil. Genesis.49.20 - Asher will dine on rich foods and produs food fit for kings.",
    oneWord: "creative and unpredictable",
    origin: "Oyo State",
    whatsapp: "2348000000000",
    email: "asherolabode@gmail.com"
    // portfolio: "https://tijesu.me"
  },
  {
    name: "Araoye Busolami",
    // nickname: "The Visionary",
    image: "/beautyblack.jpeg",
    dob: "June 15th",
    unit: "Sanctuary keepers,  Drama Unit",
    department: "Science Laboratory Technology",
    moment: "Praise session and drama ministration",
    status: "Single & Purpose-driven",
    skill: "Sell footwears",
    hobbies: "Reading",
    quote: "Philippians 4:19.",
    oneWord: "Industrious",
    origin: "Osun State",
    whatsapp: "2348000000000",
    email: "busolaaraoye@gmail.com"
    // portfolio: "https://tijesu.me"
  },
  {
    name: "Akinyemi Imoleayo Akinlabi",
    // nickname: "The Visionary",
    image: "/imole.jpeg",
    dob: "October 31st",
    unit: "Media team",
    department: "Computer Engineering",
    moment: "Thanksgiving",
    status: "Single & Purpose-driven",
    skill: "Nil",
    hobbies: "Watching movies",
    quote: "Isaiah.49.15 Can a woman forget her sucking child, that she should not have compassion on the son of her womb? yea, they may forget, yet will I not forget thee.",
    oneWord: "Optimist",
    origin: "Osun State",
    whatsapp: "2348000000000",
    email: "imoleayoakinyemi@gmail.com"
    // portfolio: "https://tijesu.me"
  },
  // {
  //   name: "Mac Kennie",
  //   // nickname: "The Visionary",
  //   image: "/daniel.jpg",
  //   dob: "July 26th",
  //   unit: "Ushering, Sanctuary keepers, Evangelism, Prayer team, Drama, Protocol, Children's Teacher, Media, Sunday School",
  //   department: "Pure and Applied Chemistry",
  //   moment: "Sunday school period",
  //   status: "Single & Purpose-driven",
  //   skill: "Realtor",
  //   hobbies: "Cooking and Singing",
  //   quote: "Ps.34.9 - Oh, fear the Lord, you His saints! There is no want to those who fear Him.",
  //   oneWord: "Driving",
  //   origin: "Osun State",
  //   whatsapp: "2348000000000",
  //   email: "danielamos641@gmail.com"
  //   // portfolio: "https://tijesu.me"
  // },
  // Add other members...
];

export default function MeetFYB() {
  return (
    <section className="py-24 md:py-32 px-4 md:px-6 bg-[#F5E9DA]" id="faces">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="flex justify-center items-center mb-6 gap-3"
          >
            <div className="w-10 h-px bg-[#D4AF37]" />
            <span className="text-[10px] tracking-[0.6em] text-[#D4AF37] uppercase font-black">The Covenant Registry</span>
            <div className="w-10 h-px bg-[#D4AF37]" />
          </motion.div>

          <h2 className="text-5xl md:text-8xl font-serif text-[#3B2A26] mb-8">Meet The Prodigies</h2>
          <p className="max-w-2xl mx-auto text-[#3B2A26]/70 font-sans text-lg italic">
            &quot;For I know the plans I have for you,&quot; declares the Lord. Meet the generation set apart for greatness.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-14">
          {graduates.map((grad, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: (index % 3) * 0.1 }}
              viewport={{ once: true }}
            >
              <MemberCard {...grad} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}