import { Home, People, ManageAccounts, Message} from '@mui/icons-material';

export const sidebar = [
    { 
      title: "Homepage",
      icon: Home,
      color: "success"
    },
    { 
      title: "Friends",
      icon: People,
      color: "primary",
      link: "/friends"
    },
    { 
      title: "Settings",
      icon: ManageAccounts,
      color: "secondary"
    },
    { 
      title: "Messages",
      icon: Message,
      color: "error"
    },
]