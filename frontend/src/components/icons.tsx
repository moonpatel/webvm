import {
  Command,
  Loader2,
  X,
  ChevronLeft,
  ChevronRight,
  Trash,
  FileText,
  Settings,
  CreditCard,
  MoreVertical,
  Plus,
  AlertTriangle,
  User,
  ArrowRight,
  HelpCircle,
  Pizza,
  SunMedium,
  Moon,
  Laptop,
  Server,
} from "lucide-react";

import ubuntu from "../../public/128/128_ubuntu.png";
import mint from "../../public/128/128_mint.png";
import fedora from "../../public/128/128_fedora_newlogo.png";
import alpine from "../../public/128/128_alpine.png";
import kali from "../../public/128/128_kali.png";
import arch from "../../public/128/128_arch.png";
import opensuse from "../../public/128/128_suse.png";
import redhat from "../../public/128/128_redhat.png";

export const Icons = {
  logo: Command,
  close: X,
  spinner: Loader2,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  trash: Trash,
  post: FileText,
  page: File,
  media: Image,
  settings: Settings,
  billing: CreditCard,
  ellipsis: MoreVertical,
  add: Plus,
  warning: AlertTriangle,
  user: User,
  arrowRight: ArrowRight,
  help: HelpCircle,
  pizza: Pizza,
  sun: SunMedium,
  moon: Moon,
  laptop: Laptop,
  server: Server,
};

export const DistroIcons = {
  ubuntu: ubuntu,
  mint: mint,
  fedora: fedora,
  alpine: alpine,
  kali: kali,
  arch: arch,
  opensuse: opensuse,
  redhat: redhat,
};
