import dayjs from 'dayjs';

const Footer = () => {
  const currentYear = dayjs().year();
  return (
    <footer className="flex items-center justify-center bg-[#691f74] text-white p-4 mt-auto">
      {currentYear} RecruitMe. All rights reserved.
    </footer>
  );
};

export default Footer;
