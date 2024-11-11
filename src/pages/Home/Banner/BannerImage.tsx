import { ProfileBanner } from '~/assets/img';
import ClipPathImageShowcase, {
  ClipPaths,
} from '~/components/ClipPath/ClipPathBannerImage';
import {
  CardBanner1,
  CardBanner2,
  CardBanner3,
  CardBanner4,
  CardBanner5,
  CardBanner6,
  CardBanner7,
} from '~/assets/img';

const imageArray: ClipPaths[] = [
  { logo: CardBanner1, width: 208 },
  { logo: CardBanner1, width: 208 },
  { logo: CardBanner2, width: 224 },
  { logo: CardBanner3, width: 240 },
  { logo: CardBanner4 },
  { logo: CardBanner5, width: 240 },
  { logo: CardBanner6, width: 224 },
  { logo: CardBanner7, width: 208 },
];

const BannerImage = () => (
  <div className="lg:relative col-span-1 lg:col-span-1 flex lg:flex-row justify-between lg:justify-end items-center lg:items-start">
    <div className="hidden lg:block lg:absolute lg:right-72 lg:top-2 w-64 space-y-10">
      <ClipPathImageShowcase clipPaths={imageArray} />
    </div>
    <img
      src={ProfileBanner}
      alt="banner-profile"
      className="object-fill lg:w-64 lg:h-96"
    />
  </div>
);

export default BannerImage;
