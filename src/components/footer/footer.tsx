import Sogan from "./slogannn";

export default function Footer() {
  return (
    <footer className="w-full h-fit bg-black/50 flex backdrop-blur-md border-t-2 border-white/10">
      <div className="w-1/2 flex flex-row justify-center items-center gap-4">
        <h3 className="text-3xl font-bold text-white tracking-widest uppercase -rotate-90 text-nowrap">Contact</h3>
        {/* Main Trunk Container */}
        <div className="flex flex-col items-start gap-6 border-l-2 border-white/20 pl-6 py-4">
          {contactData.map((node, index) => (
            <ContactNodeRenderer key={index} node={node} />
          ))}
        </div>
      </div>
      <div className="w-1/2 items-center justify-center flex ">
              <Sogan />
      </div>
    </footer>
  );
}

interface ContactNode {
  icon?: string;
  url?: string;
  label?: string;
  highlight?: boolean;
  children?: ContactNode[];
}

const contactData: ContactNode[] = [
  {
    icon: "/mail.svg",
    url: "mailto:contact@zzyzx.com",
    label: "@ZzyzxLabs",
    highlight: true,
  },
  {
    icon: "/github-mark.svg",
    url: "https://github.com/ZzyzxLabs",
    label: "@ZzyzxLabs",
  },
  {
    // The Branch Node (Splits into X paths)
    // No icon/label/url -> renders as a structural split
    children: [
      {
        icon: "/X_icon.svg",
        url: "https://x.com/",
        label: "@ZzyzxLabs",
      },
      {
        icon: "/X_icon.svg",
        url: "https://x.com/",
        label: "@ZzyzxLabs",
      },
    ],
  },
  {
    icon: "/telegram.svg",
    url: "https://t.me/ZzyzxLabs",
    label: "@ZzyzxLabs",
  },
];

const ContactNodeRenderer = ({ node }: { node: ContactNode }) => {
  const hasContent = node.icon && node.label;
  
  return (
    <div className="relative">
      {/* Horizontal Connector from parent trunk */}
      <div className="absolute -left-6 top-4 w-6 border-t-2 border-white/20"></div>

      {/* Node Content (if exists) */}
      {hasContent ? (
        <a
          href={node.url}
          target={node.highlight ? undefined : "_blank"}
          rel={node.highlight ? undefined : "noreferrer"}
          className={`group flex items-center gap-3 opacity-80 hover:opacity-100 transition-opacity ${
            node.highlight ? "pr-2 rounded-r-full" : ""
          }`}
        >
          {node.highlight ? (
            <div className="bg-white rounded-full p-1.5 w-8 h-8 flex items-center justify-center relative z-20">
              {/* @ts-ignore */}
              <img src={node.icon} alt="icon" className="w-full h-full" />
            </div>
          ) : (
            // @ts-ignore
            <img src={node.icon} alt="icon" className="w-8 h-8 invert" />
          )}
          <span className="text-white text-lg flex items-center gap-1">
            <span className="transition-transform duration-300 group-hover:translate-x-1">&gt;</span>
            <span>{node.label}</span>
          </span>
        </a>
      ) : (
        // Empty structural node - acts as an anchor for the split vertical line
        <div className="h-0 w-0" /> 
      )}

      {/* Children Tree */}
      {node.children && node.children.length > 0 && (
        <div 
          className={`relative flex flex-col gap-6 pt-4 
            ${hasContent ? "ml-4 pl-6 border-l-2 border-white/20" : "pl-6"}
          `}
        >
          
          {/* 
            If structural node (no content), draw a secondary trunk for children 
            that connects the incoming horizontal line to the children.
          */}
          {!hasContent && (
             <div className="absolute left-0 top-4 bottom-4 border-l-2 border-white/20" />
          )}

          {node.children.map((child, index) => (
            <ContactNodeRenderer key={index} node={child} />
          ))}
        </div>
      )}
    </div>
  );
};
