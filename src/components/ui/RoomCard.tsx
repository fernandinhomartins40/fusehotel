import React from 'react';

interface RoomCardProps {
  title: string;
  description: string;
  image: string;
  area: string;
  capacity: string;
  price: string;
}

export const RoomCard: React.FC<RoomCardProps> = ({
  title,
  description,
  image,
  area,
  capacity,
  price
}) => {
  return (
    <div className="w-[387px] border overflow-hidden rounded-[10px] border-solid border-[#DFE1E4] max-sm:w-full">
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="w-full h-[243px] object-cover"
        />
        <div className="absolute text-white text-[11.2px] uppercase bg-[#0466C8] px-4 py-2 rounded-[5px] left-px top-[31px]">
          Café da Manhã Incluso
        </div>
      </div>

      <h3 className="text-[#1D1D1F] text-[28px] leading-[42px] tracking-[0.4px] pt-5 pb-0 px-[19px]">
        {title}
      </h3>
      
      <p className="text-[#676C76] text-[12.8px] leading-[22px] px-[19px] py-3.5">
        {description}
      </p>

      <div className="flex gap-4 px-[19px] py-5 border-b-[#DFE1E4] border-b border-solid">
        <div className="flex items-center gap-[8.5px] text-[#676C76] text-base">
          <svg width="14" height="14" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.715 9.76624V12.8287C13.7152 12.915 13.6984 13.0004 13.6655 13.0801C13.6326 13.1598 13.5843 13.2323 13.5233 13.2933C13.4623 13.3542 13.3899 13.4026 13.3101 13.4355C13.2304 13.4684 13.145 13.4852 13.0587 13.485H9.99625C9.41137 13.485 9.11879 12.7768 9.5314 12.3639L10.5212 11.374L7.59 8.4428L4.65793 11.3768L5.64859 12.3639C6.06121 12.7768 5.76863 13.485 5.18375 13.485H2.12125C2.03501 13.4852 1.94957 13.4684 1.86986 13.4355C1.79014 13.4026 1.71771 13.3542 1.65673 13.2933C1.59575 13.2323 1.54741 13.1598 1.51451 13.0801C1.48161 13.0004 1.46478 12.915 1.465 12.8287V9.76624C1.465 9.18108 2.17293 8.8885 2.58609 9.30139L3.57566 10.2912L6.50883 7.35999L3.57539 4.426L2.58609 5.41858C2.1732 5.83147 1.465 5.53889 1.465 4.95374V1.89124C1.46478 1.805 1.48161 1.71956 1.51451 1.63985C1.54741 1.56013 1.59575 1.4877 1.65673 1.42672C1.71771 1.36573 1.79014 1.3174 1.86986 1.2845C1.94957 1.2516 2.03501 1.23477 2.12125 1.23499H5.18375C5.76863 1.23499 6.06121 1.94319 5.64859 2.35608L4.65875 3.34592L7.59 6.27717L10.5221 3.34319L9.5314 2.35608C9.11879 1.94319 9.41137 1.23499 9.99625 1.23499H13.0587C13.145 1.23477 13.2304 1.2516 13.3101 1.2845C13.3899 1.3174 13.4623 1.36573 13.5233 1.42672C13.5843 1.4877 13.6326 1.56013 13.6655 1.63985C13.6984 1.71956 13.7152 1.805 13.715 1.89124V4.95374C13.715 5.53889 13.0071 5.83147 12.5939 5.41858L11.6043 4.42874L8.67117 7.35999L11.6046 10.294L12.5939 9.30413C13.0068 8.8885 13.715 9.18108 13.715 9.76624Z" fill="#0466C8"/>
          </svg>
          <span>{area}</span>
        </div>
        <div className="flex items-center gap-[8.5px] text-[#676C76] text-base">
          <svg width="14" height="14" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.4 8.67249C9.61525 8.67249 9.2379 9.10999 7.95001 9.10999C6.66212 9.10999 6.28751 8.67249 5.50001 8.67249C3.47111 8.67249 1.82501 10.3186 1.82501 12.3475V13.0475C1.82501 13.7721 2.4129 14.36 3.13751 14.36H12.7625C13.4871 14.36 14.075 13.7721 14.075 13.0475V12.3475C14.075 10.3186 12.4289 8.67249 10.4 8.67249Z" fill="#0466C8"/>
          </svg>
          <span>{capacity}</span>
        </div>
      </div>

      <div className="text-[#676C76] text-base px-[19px] py-5">
        <span>A partir de: </span>
        <span className="font-bold">{price}</span>
      </div>
    </div>
  );
};
