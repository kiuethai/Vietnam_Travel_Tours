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
  { id: 100, label: 'Dashboard', link: '/admin/dashboard', icon: <HomeIcon /> },
  { id: 0, label: 'Quản lý Admin', link: '/admin/profile', icon: <ProfileIcon /> },
  {
    id: 1,
    label: 'Quản lý người dùng',
    link: '/admin/users',
    badgeColor: 'secondary',
    icon: <PersonIcon />
  },
  {
    id: 2,
    label: 'Quản lý Tour',
    badgeColor: 'success',
    link: 'tours/addtours',
    icon: <ShoppingCartIcon />,
    children: [
      {
        label: 'Thêm Tour',
        link: '/admin/tours/addtours',
      },
      {
        label: 'Danh sách Tour',
        link: '/admin/tours/getAllTour',
      }
    ],
  },

  {
    id: 3,
    label: 'Quảng lý Booking',
    link: '/admin/bookings',
    icon: <DocumentationIcon />,
  },
  {
    id: 4,
    label: 'Contact',
    icon: <SupportIcon />,
    link: '/admin/contact',
  },
  ,
  {
    id: 5,
    label: 'Chat',
    icon: <ChatIcon />,
    // link: '/admin/bookings',
  },
];

export default structure;
