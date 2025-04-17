import React from 'react';
import {
  Home as HomeIcon,
  FilterNone as UIElementsIcon,
  BorderAll as TableIcon,
  QuestionAnswer as SupportIcon,
  LibraryBooks as LibraryIcon,
  HelpOutline as FAQIcon,
  BarChart as ChartIcon,
  Map as MapIcon,
  Apps as CoreIcon,
  Description as DescriptionIcon,
  ShoppingCart as ShoppingCartIcon,
  StarBorder as ExtraIcon,
  AddCircle as AddSectionIcon,
  FolderOpen as FolderIcon,
  Description as DocumentationIcon,
  Person as PersonIcon,
  AccountCircle as ProfileIcon
} from '@mui/icons-material';
import ChatIcon from '@mui/icons-material/Chat';
import ViewCompactRoundedIcon from '@mui/icons-material/ViewCompactRounded';

// components
import Dot from './components/Dot';

const structure = [
  { id: 100, label: 'Quản lý Admin', link: '/admin/profile', icon: <ProfileIcon /> },
  { id: 0, label: 'Dashboard', link: '/admin/dashboard', icon: <HomeIcon /> },
  {
    id: 1,
    label: 'E-commerce',
    badgeColor: 'success',
    link: '/profile/ecommerce',
    icon: <ShoppingCartIcon />,
    children: [
      {
        label: 'Product Manage',
        link: '/profile/ecommerce/management',
      },
      {
        label: 'Products Grid',
        link: '/profile/ecommerce/gridproducts',
      },
      {
        label: 'Product Page',
        link: '/profile/ecommerce/product',
      },
    ],
  },
  {
    id: 2,
    label: 'Quản lý người dùng',
    link: '/admin/users',
    badgeColor: 'secondary',
    icon: <PersonIcon />
  },
  {
    id: 3,
    label: 'Documentation',
    link: '/documentation',
    icon: <DocumentationIcon />,
  },
  {
    id: 4,
    label: 'Chat',
    icon: <ChatIcon />,
    click: function (event, ...rest) {
      const name = 'chatSetOpen'
      rest.forEach(c => {
        if (c.clickName === name) {
          return c(event)
        }
        return false
      })
    },
  },
];

export default structure;
