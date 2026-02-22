import svgPaths from "./svg-rdf8s4c3v9";
import imgProfileImage from "figma:asset/8dddf9bb8dd8ad48ec178a75d6c42890450f9014.png";
import imgAModernUserInterfaceDesignDisplayedOnASleekTabletWithVibrantColorsAndIntuitiveNavigationElements from "figma:asset/4649679e6adfde00ad07605232b63f514a51dcae.png";

function NavigationLinks() {
  return (
    <div className="content-stretch flex font-['SF_Pro:Regular',sans-serif] font-normal gap-[32px] items-start leading-[34px] relative shrink-0 text-[#281d1b] text-[28px] tracking-[0.38px]" data-name="Navigation Links">
      <p className="relative shrink-0" style={{ fontVariationSettings: "\'wdth\' 100" }}>
        Кейсы
      </p>
      <p className="relative shrink-0" style={{ fontVariationSettings: "\'wdth\' 100" }}>
        Обо мне
      </p>
    </div>
  );
}

function Header() {
  return (
    <div className="bg-[#fffbfa] content-stretch flex items-center justify-between py-[16px] relative shrink-0 w-full z-[2]" data-name="Header">
      <p className="font-['SF_Pro:Regular',sans-serif] font-normal leading-[34px] relative shrink-0 text-[#281d1b] text-[28px] tracking-[0.38px]" style={{ fontVariationSettings: "\'wdth\' 100" }}>
        Alexander Petrov
      </p>
      <NavigationLinks />
      <div className="absolute bottom-0 h-0 left-[-80px] right-[-80px]" data-name="divider">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
          <g id="divider" />
        </svg>
      </div>
    </div>
  );
}

function NameAndLocation() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-h-px min-w-px relative text-[#281d1b]" data-name="Name and Location">
      <p className="font-['SF_Pro:Bold',sans-serif] font-bold leading-[41px] relative shrink-0 text-[34px] tracking-[0.4px]" style={{ fontVariationSettings: "\'wdth\' 100" }}>
        Александр Петров
      </p>
      <p className="font-['SF_Pro:Regular',sans-serif] font-normal leading-[28px] relative shrink-0 text-[22px] tracking-[-0.26px]" style={{ fontVariationSettings: "\'wdth\' 100" }}>
        Москва, Россия
      </p>
    </div>
  );
}

function Buttons() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0" data-name="Buttons">
      <div className="bg-[#fffbfa] content-stretch flex gap-[8px] items-center justify-center px-[24px] py-[12px] relative rounded-[100px] shrink-0" data-name="Telegram Button">
        <div aria-hidden="true" className="absolute border border-[rgba(120,120,128,0.16)] border-solid inset-0 pointer-events-none rounded-[100px]" />
        <div className="relative shrink-0 size-[28px]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
            <g id="Vector">
              <path d="M28 0H0V28H28V0Z" fill="white" />
              <path d={svgPaths.p39be0f70} fill="url(#paint0_linear_1_123)" />
              <path d={svgPaths.p2b50ec0} fill="var(--fill-0, white)" />
            </g>
            <defs>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_123" x1="1400" x2="1400" y1="0" y2="2800">
                <stop stopColor="#2AABEE" />
                <stop offset="1" stopColor="#229ED9" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <p className="font-['SF_Pro:Regular',sans-serif] font-normal leading-[22px] relative shrink-0 text-[#281d1b] text-[17px] tracking-[-0.43px]" style={{ fontVariationSettings: "\'wdth\' 100" }}>
          Telegram
        </p>
      </div>
      <div className="bg-[#fffbfa] content-stretch flex gap-[8px] items-center justify-center px-[24px] py-[12px] relative rounded-[100px] shrink-0" data-name="CV Button">
        <div aria-hidden="true" className="absolute border border-[rgba(120,120,128,0.16)] border-solid inset-0 pointer-events-none rounded-[100px]" />
        <div className="relative shrink-0 size-[28px]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
            <g id="Vector">
              <path d="M28 0H0V28H28V0Z" fill="white" />
              <path d={svgPaths.p39be0f70} fill="url(#paint0_linear_1_123)" />
              <path d={svgPaths.p2b50ec0} fill="var(--fill-0, white)" />
            </g>
            <defs>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_123" x1="1400" x2="1400" y1="0" y2="2800">
                <stop stopColor="#2AABEE" />
                <stop offset="1" stopColor="#229ED9" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <p className="font-['SF_Pro:Regular',sans-serif] font-normal leading-[22px] relative shrink-0 text-[#281d1b] text-[17px] tracking-[-0.43px]" style={{ fontVariationSettings: "\'wdth\' 100" }}>
          CV
        </p>
      </div>
    </div>
  );
}

function ContactInfo() {
  return (
    <div className="content-stretch flex gap-[12px] items-end relative shrink-0 w-full" data-name="Contact Info">
      <NameAndLocation />
      <Buttons />
    </div>
  );
}

function Title() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-full items-start justify-between min-h-px min-w-px relative" data-name="Title">
      <p className="font-['SF_Pro:Bold',sans-serif] font-bold leading-[100px] relative shrink-0 text-[#281d1b] text-[100px] tracking-[0.4px] w-full whitespace-pre-wrap" style={{ fontVariationSettings: "\'wdth\' 100" }}>
        Product Designer
      </p>
      <ContactInfo />
    </div>
  );
}

function ProfileImage() {
  return (
    <div className="relative rounded-[42px] shrink-0 size-[416px]" data-name="Profile Image">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[42px] size-full" src={imgProfileImage} />
    </div>
  );
}

function TitleSection() {
  return (
    <div className="bg-[#fffbfa] content-stretch flex gap-[48px] items-center py-[48px] relative shrink-0 w-full z-[3]" data-name="Title Section">
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <Title />
      </div>
      <ProfileImage />
    </div>
  );
}

function Header1() {
  return (
    <div className="content-stretch flex items-center pb-[16px] relative shrink-0 w-full" data-name="Header">
      <div aria-hidden="true" className="absolute border-[#ccc] border-b border-solid inset-0 pointer-events-none" />
      <p className="flex-[1_0_0] font-['SF_Pro:Regular',sans-serif] font-normal leading-[34px] min-h-px min-w-px overflow-hidden relative text-[#281d1b] text-[28px] text-ellipsis tracking-[0.38px] whitespace-nowrap" style={{ fontVariationSettings: "\'wdth\' 100" }}>
        Комус
      </p>
    </div>
  );
}

function ProductInfo() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0" data-name="Product Info">
      <div className="flex flex-col font-['SF_Pro:Semibold',sans-serif] font-[590] justify-center relative shrink-0 text-[#9d9ea2] text-[17px] tracking-[-0.43px] w-full" style={{ fontVariationSettings: "\'wdth\' 100" }}>
        <p className="leading-[22px] whitespace-pre-wrap">Продукт</p>
      </div>
      <div className="flex flex-col font-['SF_Pro:Regular',sans-serif] font-normal justify-center relative shrink-0 text-[#281d1b] text-[20px] tracking-[-0.45px] w-full" style={{ fontVariationSettings: "\'wdth\' 100" }}>
        <p className="leading-[25px] whitespace-pre-wrap">E-commerce</p>
      </div>
    </div>
  );
}

function PlatformInfo() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0" data-name="Platform Info">
      <div className="flex flex-col font-['SF_Pro:Semibold',sans-serif] font-[590] justify-center relative shrink-0 text-[#9d9ea2] text-[17px] tracking-[-0.43px] w-full" style={{ fontVariationSettings: "\'wdth\' 100" }}>
        <p className="leading-[22px] whitespace-pre-wrap">Платформа</p>
      </div>
      <div className="flex flex-col font-['SF_Pro:Regular',sans-serif] font-normal justify-center relative shrink-0 text-[#281d1b] text-[20px] tracking-[-0.45px] w-full" style={{ fontVariationSettings: "\'wdth\' 100" }}>
        <p className="leading-[25px] whitespace-pre-wrap">Web, Mobile</p>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex gap-[42px] items-start leading-[0] relative shrink-0 w-full" data-name="Container">
      <ProductInfo />
      <PlatformInfo />
    </div>
  );
}

function AModernUserInterfaceDesignDisplayedOnASleekTabletWithVibrantColorsAndIntuitiveNavigationElements() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px pointer-events-none relative rounded-[24px] w-full" data-name="A modern user interface design displayed on a sleek tablet with vibrant colors and intuitive navigation elements.">
      <div aria-hidden="true" className="absolute inset-0 rounded-[24px]">
        <img alt="" className="absolute max-w-none object-cover rounded-[24px] size-full" src={imgAModernUserInterfaceDesignDisplayedOnASleekTabletWithVibrantColorsAndIntuitiveNavigationElements} />
        <div className="absolute bg-[#f3efee] inset-0 rounded-[24px]" />
      </div>
      <div aria-hidden="true" className="absolute border-[1.5px] border-[rgba(0,0,0,0)] border-solid inset-0 rounded-[24px]" />
    </div>
  );
}

function Header2() {
  return (
    <div className="content-stretch flex items-center pb-[16px] relative shrink-0 w-full" data-name="Header">
      <div aria-hidden="true" className="absolute border-[#ccc] border-b border-solid inset-0 pointer-events-none" />
      <p className="flex-[1_0_0] font-['SF_Pro:Regular',sans-serif] font-normal leading-[34px] min-h-px min-w-px overflow-hidden relative text-[#281d1b] text-[28px] text-ellipsis tracking-[0.38px] whitespace-nowrap" style={{ fontVariationSettings: "\'wdth\' 100" }}>
        Комус
      </p>
    </div>
  );
}

function ProductInfo1() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0" data-name="Product Info">
      <div className="flex flex-col font-['SF_Pro:Semibold',sans-serif] font-[590] justify-center relative shrink-0 text-[#9d9ea2] text-[17px] tracking-[-0.43px] w-full" style={{ fontVariationSettings: "\'wdth\' 100" }}>
        <p className="leading-[22px] whitespace-pre-wrap">Продукт</p>
      </div>
      <div className="flex flex-col font-['SF_Pro:Regular',sans-serif] font-normal justify-center relative shrink-0 text-[#281d1b] text-[20px] tracking-[-0.45px] w-full" style={{ fontVariationSettings: "\'wdth\' 100" }}>
        <p className="leading-[25px] whitespace-pre-wrap">E-commerce</p>
      </div>
    </div>
  );
}

function PlatformInfo1() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0" data-name="Platform Info">
      <div className="flex flex-col font-['SF_Pro:Semibold',sans-serif] font-[590] justify-center relative shrink-0 text-[#9d9ea2] text-[17px] tracking-[-0.43px] w-full" style={{ fontVariationSettings: "\'wdth\' 100" }}>
        <p className="leading-[22px] whitespace-pre-wrap">Платформа</p>
      </div>
      <div className="flex flex-col font-['SF_Pro:Regular',sans-serif] font-normal justify-center relative shrink-0 text-[#281d1b] text-[20px] tracking-[-0.45px] w-full" style={{ fontVariationSettings: "\'wdth\' 100" }}>
        <p className="leading-[25px] whitespace-pre-wrap">Web, Mobile</p>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex gap-[42px] items-start leading-[0] relative shrink-0 w-full" data-name="Container">
      <ProductInfo1 />
      <PlatformInfo1 />
    </div>
  );
}

function AModernUserInterfaceDesignDisplayedOnASleekTabletWithVibrantColorsAndIntuitiveNavigationElements1() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px pointer-events-none relative rounded-[24px] w-full" data-name="A modern user interface design displayed on a sleek tablet with vibrant colors and intuitive navigation elements.">
      <div aria-hidden="true" className="absolute inset-0 rounded-[24px]">
        <img alt="" className="absolute max-w-none object-cover rounded-[24px] size-full" src={imgAModernUserInterfaceDesignDisplayedOnASleekTabletWithVibrantColorsAndIntuitiveNavigationElements} />
        <div className="absolute bg-[#f3efee] inset-0 rounded-[24px]" />
      </div>
      <div aria-hidden="true" className="absolute border-[1.5px] border-[rgba(0,0,0,0)] border-solid inset-0 rounded-[24px]" />
    </div>
  );
}

function Header3() {
  return (
    <div className="content-stretch flex items-center pb-[16px] relative shrink-0 w-full" data-name="Header">
      <div aria-hidden="true" className="absolute border-[#ccc] border-b border-solid inset-0 pointer-events-none" />
      <p className="flex-[1_0_0] font-['SF_Pro:Regular',sans-serif] font-normal leading-[34px] min-h-px min-w-px overflow-hidden relative text-[#281d1b] text-[28px] text-ellipsis tracking-[0.38px] whitespace-nowrap" style={{ fontVariationSettings: "\'wdth\' 100" }}>
        Комус
      </p>
    </div>
  );
}

function ProductInfo2() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0" data-name="Product Info">
      <div className="flex flex-col font-['SF_Pro:Semibold',sans-serif] font-[590] justify-center relative shrink-0 text-[#9d9ea2] text-[17px] tracking-[-0.43px] w-full" style={{ fontVariationSettings: "\'wdth\' 100" }}>
        <p className="leading-[22px] whitespace-pre-wrap">Продукт</p>
      </div>
      <div className="flex flex-col font-['SF_Pro:Regular',sans-serif] font-normal justify-center relative shrink-0 text-[#281d1b] text-[20px] tracking-[-0.45px] w-full" style={{ fontVariationSettings: "\'wdth\' 100" }}>
        <p className="leading-[25px] whitespace-pre-wrap">E-commerce</p>
      </div>
    </div>
  );
}

function PlatformInfo2() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0" data-name="Platform Info">
      <div className="flex flex-col font-['SF_Pro:Semibold',sans-serif] font-[590] justify-center relative shrink-0 text-[#9d9ea2] text-[17px] tracking-[-0.43px] w-full" style={{ fontVariationSettings: "\'wdth\' 100" }}>
        <p className="leading-[22px] whitespace-pre-wrap">Платформа</p>
      </div>
      <div className="flex flex-col font-['SF_Pro:Regular',sans-serif] font-normal justify-center relative shrink-0 text-[#281d1b] text-[20px] tracking-[-0.45px] w-full" style={{ fontVariationSettings: "\'wdth\' 100" }}>
        <p className="leading-[25px] whitespace-pre-wrap">Web, Mobile</p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex gap-[42px] items-start leading-[0] relative shrink-0 w-full" data-name="Container">
      <ProductInfo2 />
      <PlatformInfo2 />
    </div>
  );
}

function AModernUserInterfaceDesignDisplayedOnASleekTabletWithVibrantColorsAndIntuitiveNavigationElements2() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px pointer-events-none relative rounded-[24px] w-full" data-name="A modern user interface design displayed on a sleek tablet with vibrant colors and intuitive navigation elements.">
      <div aria-hidden="true" className="absolute inset-0 rounded-[24px]">
        <img alt="" className="absolute max-w-none object-cover rounded-[24px] size-full" src={imgAModernUserInterfaceDesignDisplayedOnASleekTabletWithVibrantColorsAndIntuitiveNavigationElements} />
        <div className="absolute bg-[#f3efee] inset-0 rounded-[24px]" />
      </div>
      <div aria-hidden="true" className="absolute border-[1.5px] border-[rgba(0,0,0,0)] border-solid inset-0 rounded-[24px]" />
    </div>
  );
}

function Header4() {
  return (
    <div className="content-stretch flex items-center pb-[16px] relative shrink-0 w-full" data-name="Header">
      <div aria-hidden="true" className="absolute border-[#ccc] border-b border-solid inset-0 pointer-events-none" />
      <p className="flex-[1_0_0] font-['SF_Pro:Regular',sans-serif] font-normal leading-[34px] min-h-px min-w-px overflow-hidden relative text-[#281d1b] text-[28px] text-ellipsis tracking-[0.38px] whitespace-nowrap" style={{ fontVariationSettings: "\'wdth\' 100" }}>
        Комус
      </p>
    </div>
  );
}

function ProductInfo3() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0" data-name="Product Info">
      <div className="flex flex-col font-['SF_Pro:Semibold',sans-serif] font-[590] justify-center relative shrink-0 text-[#9d9ea2] text-[17px] tracking-[-0.43px] w-full" style={{ fontVariationSettings: "\'wdth\' 100" }}>
        <p className="leading-[22px] whitespace-pre-wrap">Продукт</p>
      </div>
      <div className="flex flex-col font-['SF_Pro:Regular',sans-serif] font-normal justify-center relative shrink-0 text-[#281d1b] text-[20px] tracking-[-0.45px] w-full" style={{ fontVariationSettings: "\'wdth\' 100" }}>
        <p className="leading-[25px] whitespace-pre-wrap">E-commerce</p>
      </div>
    </div>
  );
}

function PlatformInfo3() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0" data-name="Platform Info">
      <div className="flex flex-col font-['SF_Pro:Semibold',sans-serif] font-[590] justify-center relative shrink-0 text-[#9d9ea2] text-[17px] tracking-[-0.43px] w-full" style={{ fontVariationSettings: "\'wdth\' 100" }}>
        <p className="leading-[22px] whitespace-pre-wrap">Платформа</p>
      </div>
      <div className="flex flex-col font-['SF_Pro:Regular',sans-serif] font-normal justify-center relative shrink-0 text-[#281d1b] text-[20px] tracking-[-0.45px] w-full" style={{ fontVariationSettings: "\'wdth\' 100" }}>
        <p className="leading-[25px] whitespace-pre-wrap">Web, Mobile</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex gap-[42px] items-start leading-[0] relative shrink-0 w-full" data-name="Container">
      <ProductInfo3 />
      <PlatformInfo3 />
    </div>
  );
}

function AModernUserInterfaceDesignDisplayedOnASleekTabletWithVibrantColorsAndIntuitiveNavigationElements3() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px pointer-events-none relative rounded-[24px] w-full" data-name="A modern user interface design displayed on a sleek tablet with vibrant colors and intuitive navigation elements.">
      <div aria-hidden="true" className="absolute inset-0 rounded-[24px]">
        <img alt="" className="absolute max-w-none object-cover rounded-[24px] size-full" src={imgAModernUserInterfaceDesignDisplayedOnASleekTabletWithVibrantColorsAndIntuitiveNavigationElements} />
        <div className="absolute bg-[#f3efee] inset-0 rounded-[24px]" />
      </div>
      <div aria-hidden="true" className="absolute border-[1.5px] border-[rgba(0,0,0,0)] border-solid inset-0 rounded-[24px]" />
    </div>
  );
}

function ProjectsRow() {
  return (
    <div className="bg-[#fffbfa] content-start flex flex-wrap gap-[48px] items-start overflow-clip py-[48px] relative shrink-0 w-full z-[2]" data-name="Projects Row">
      <div className="content-stretch flex flex-[1_0_0] flex-col gap-[16px] h-[548px] items-start min-h-px min-w-[648px] relative" data-name="Project1">
        <Header1 />
        <Container />
        <AModernUserInterfaceDesignDisplayedOnASleekTabletWithVibrantColorsAndIntuitiveNavigationElements />
      </div>
      <div className="content-stretch flex flex-[1_0_0] flex-col gap-[16px] h-[548px] items-start min-h-px min-w-[648px] relative" data-name="Project1">
        <Header2 />
        <Container1 />
        <AModernUserInterfaceDesignDisplayedOnASleekTabletWithVibrantColorsAndIntuitiveNavigationElements1 />
      </div>
      <div className="content-stretch flex flex-[1_0_0] flex-col gap-[16px] h-[548px] items-start min-h-px min-w-[648px] relative" data-name="Project1">
        <Header3 />
        <Container2 />
        <AModernUserInterfaceDesignDisplayedOnASleekTabletWithVibrantColorsAndIntuitiveNavigationElements2 />
      </div>
      <div className="content-stretch flex flex-[1_0_0] flex-col gap-[16px] h-[548px] items-start min-h-px min-w-[648px] relative" data-name="Project1">
        <Header4 />
        <Container3 />
        <AModernUserInterfaceDesignDisplayedOnASleekTabletWithVibrantColorsAndIntuitiveNavigationElements3 />
      </div>
    </div>
  );
}

function AboutMeSection() {
  return (
    <div className="content-stretch flex font-normal gap-[24px] items-start py-[48px] relative shrink-0 text-black w-full z-[1]" data-name="About Me Section">
      <div className="flex flex-col font-['SF_Pro:Regular',sans-serif] justify-center leading-[0] relative shrink-0 text-[42px] tracking-[0.4px] w-[324px]" style={{ fontVariationSettings: "\'wdth\' 100" }}>
        <p className="leading-none whitespace-pre-wrap">Обо мне</p>
      </div>
      <div className="flex flex-[1_0_0] flex-col font-['Roboto:Regular',sans-serif] justify-center leading-[1.2] min-h-px min-w-px relative text-[24px] whitespace-pre-wrap" style={{ fontVariationSettings: "\'wdth\' 100" }}>
        <p className="mb-[32px]">Продуктовый дизайнер с опытом в B2B/B2C E-commerce, криптосервисах и автоматизации бизнес-процессов.</p>
        <p className="mb-[32px]">Работаю по полному циклу: от исследования и постановки задач через гипотезы и метрики — до финального UI, передачи в разработку, дизайн-чека и ревью реализации.</p>
        <p>Использую аналитику, A/B-тесты, интервью и юзабилити-тестирование как основу для решений.</p>
      </div>
    </div>
  );
}

function MainContent() {
  return (
    <div className="content-stretch flex flex-col isolate items-start py-[48px] relative shrink-0 w-full z-[1]" data-name="Main Content">
      <TitleSection />
      <ProjectsRow />
      <AboutMeSection />
    </div>
  );
}

export default function PortfolioWebsite() {
  return (
    <div className="bg-[#fffbfa] content-stretch flex flex-col isolate items-start px-[48px] relative size-full" data-name="Portfolio Website">
      <Header />
      <MainContent />
    </div>
  );
}