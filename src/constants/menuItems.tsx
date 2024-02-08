import { ReactNode } from "react";
import Icon from "../utils/customIcons";


export type Category = {
  name: string;
  type: string;
  onPress: any;
  icon: ReactNode;
  innerContent: NestedItem[];
};

export type NestedItem = {
  name: string;
  onPress: any;
  icon: ReactNode;
};

export const menuItems = [{
  name: 'Supper Categories',
  type: 'regular',
  onPress: () => { },
  icon: <Icon type="material" name="home" size={20} style={{ color: 'gray' }} />,
  innerContent: [{
    name: 'add',
    icon: <Icon type="material" name="add-circle-outline" size={20} style={{ color: 'gray' }} />,
    onPress: () => {
      // navigation.navigate(HOME);
    }
  },
  {
    name: 'edit',
    icon: <Icon type="material" name="edit" size={20} style={{ color: 'gray' }} />,
    onPress: () => {
      // navigation.navigate(HOME);
    }
  },
  {
    name: 'remove',
    icon: <Icon type="material" name="delete-outline" size={20} style={{ color: 'gray' }} />,
    onPress: () => {
      // navigation.navigate(HOME);
    }
  }
  ]
},

{
  name: 'Categories',
  type: 'nested',
  onPress: () => { },
  icon: <Icon type="material" name="rule" size={16} style={{ color: 'black' }} />,
  innerContent: [{
    name: 'add',
    icon: <Icon type="material" name="add-circle-outline" size={20} style={{ color: 'gray' }} />,
    onPress: () => {
      // navigation.navigate(HOME);
    }
  },
  {
    name: 'edit',
    icon: <Icon type="material" name="edit" size={20} style={{ color: 'gray' }} />,
    onPress: () => {
      // navigation.navigate(HOME);
    }
  },
  {
    name: 'remove',
    icon: <Icon type="material" name="delete-outline" size={20} style={{ color: 'gray' }} />,
    onPress: () => {
      // navigation.navigate(HOME);
    }
  }
  ]
},
{
  name: 'Sub Categories',
  type: 'nested',
  onPress: () => { },
  icon: <Icon type="material" name="rule" size={16} style={{ color: 'gray' }} />,
  innerContent: [{
    name: 'add',
    icon: <Icon type="material" name="add-circle-outline" size={20} style={{ color: 'gray' }} />,
    onPress: () => {
      // navigation.navigate(HOME);
    }
  },
  {
    name: 'edit',
    icon: <Icon type="material" name="edit" size={20} style={{ color: 'gray' }} />,
    onPress: () => {
      // navigation.navigate(HOME);
    }
  },
  {
    name: 'remove',
    icon: <Icon type="material" name="delete-outline" size={20} style={{ color: 'gray' }} />,
    onPress: () => {
      // navigation.navigate(HOME);
    }
  }
  ]
},
{
  name: 'Investors',
  type: 'nested',
  onPress: () => { },
  icon: <Icon type="ion" name="alarm-outline" size={20} style={{ color: 'green' }} />,
  innerContent: [{
    name: 'add',
    icon: <Icon type="material" name="add-circle-outline" size={20} style={{ color: 'gray' }} />,
    onPress: () => {
      // navigation.navigate(HOME);
    }
  },
  {
    name: 'edit',
    icon: <Icon type="material" name="edit" size={20} style={{ color: 'gray' }} />,
    onPress: () => {
      // navigation.navigate(HOME);
    }
  },
  {
    name: 'remove',
    icon: <Icon type="material" name="delete-outline" size={20} style={{ color: 'gray' }} />,
    onPress: () => {
      // navigation.navigate(HOME);
    }
  }
  ]
},
{
  name: 'Fund Manager',
  type: 'nested',
  onPress: () => { },
  icon: <Icon type="ion" name="alarm-outline" size={20} style={{ color: 'green' }} />,
  innerContent: [{
    name: 'add',
    icon: <Icon type="material" name="add-circle-outline" size={20} style={{ color: 'gray' }} />,
    onPress: () => {
      // navigation.navigate(HOME);
    }
  },
  {
    name: 'edit',
    icon: <Icon type="material" name="edit" size={20} style={{ color: 'gray' }} />,
    onPress: () => {
      // navigation.navigate(HOME);
    }
  },
  {
    name: 'remove',
    icon: <Icon type="material" name="delete-outline" size={20} style={{ color: 'gray' }} />,
    onPress: () => {
      // navigation.navigate(HOME);
    }
  }
  ]
},
{
  name: 'Persons',
  type: 'nested',
  onPress: () => { },
  icon: <Icon type="ion" name="alarm-outline" size={20} style={{ color: 'green' }} />,
  innerContent: [{
    name: 'add',
    icon: <Icon type="material" name="add-circle-outline" size={20} style={{ color: 'gray' }} />,
    onPress: () => {
      // navigation.navigate(HOME);
    }
  },
  {
    name: 'edit',
    icon: <Icon type="material" name="edit" size={20} style={{ color: 'gray' }} />,
    onPress: () => {
      // navigation.navigate(HOME);
    }
  },
  {
    name: 'remove',
    icon: <Icon type="material" name="delete-outline" size={20} style={{ color: 'gray' }} />,
    onPress: () => {
      // navigation.navigate(HOME);
    }
  }
  ]
},
{
  name: 'Projects',
  type: 'nested',
  onPress: () => { },
  icon: <Icon type="ion" name="alarm-outline" size={20} style={{ color: 'green' }} />,
  innerContent: [{
    name: 'add',
    icon: <Icon type="material" name="add-circle-outline" size={20} style={{ color: 'gray' }} />,
    onPress: () => {
      // navigation.navigate(HOME);
    }
  },
  {
    name: 'edit',
    icon: <Icon type="material" name="edit" size={20} style={{ color: 'gray' }} />,
    onPress: () => {
      // navigation.navigate(HOME);
    }
  },
  {
    name: 'remove',
    icon: <Icon type="material" name="delete-outline" size={20} style={{ color: 'gray' }} />,
    onPress: () => {
      // navigation.navigate(HOME);
    }
  }
  ]
},
{
  name: 'Proposals',
  type: 'nested',
  onPress: () => { },
  icon: <Icon type="ion" name="alarm-outline" size={20} style={{ color: 'green' }} />,
  innerContent: [{
    name: 'add',
    icon: <Icon type="material" name="add-circle-outline" size={20} style={{ color: 'gray' }} />,
    onPress: () => {
      // navigation.navigate(HOME);
    }
  },
  {
    name: 'edit',
    icon: <Icon type="material" name="edit" size={20} style={{ color: 'gray' }} />,
    onPress: () => {
      // navigation.navigate(HOME);
    }
  },
  {
    name: 'remove',
    icon: <Icon type="material" name="delete-outline" size={20} style={{ color: 'gray' }} />,
    onPress: () => {
      // navigation.navigate(HOME);
    }
  }
  ]
},
{
  name: 'Accounts Records',
  type: 'nested',
  onPress: () => { },
  icon: <Icon type="ion" name="alarm-outline" size={20} style={{ color: 'green' }} />,
  innerContent: [{
    name: 'add',
    icon: <Icon type="material" name="add-circle-outline" size={20} style={{ color: 'gray' }} />,
    onPress: () => {
      // navigation.navigate(HOME);
    }
  },
  {
    name: 'edit',
    icon: <Icon type="material" name="edit" size={20} style={{ color: 'gray' }} />,
    onPress: () => {
      // navigation.navigate(HOME);
    }
  },
  {
    name: 'remove',
    icon: <Icon type="material" name="delete-outline" size={20} style={{ color: 'gray' }} />,
    onPress: () => {
      // navigation.navigate(HOME);
    }
  }
  ]
},
];

export const dailyAccountsOptions = [{
  name: 'Invest',
  type: 'regular',
  onPress: () => { },
  icon: <Icon type="material" name="home" size={20} style={{ color: 'gray' }} />,
  innerContent: [{
    name: 'add',
    icon: <Icon type="material" name="add-circle-outline" size={20} style={{ color: 'gray' }} />,
    onPress: () => {
      // navigation.navigate(HOME);
    }
  },
  {
    name: 'edit',
    icon: <Icon type="material" name="edit" size={20} style={{ color: 'gray' }} />,
    onPress: () => {
      // navigation.navigate(HOME);
    }
  },
  {
    name: 'remove',
    icon: <Icon type="material" name="delete-outline" size={20} style={{ color: 'gray' }} />,
    onPress: () => {
      // navigation.navigate(HOME);
    }
  }
  ]
},

{
  name: 'Income',
  type: 'nested',
  onPress: () => { },
  icon: <Icon type="material" name="rule" size={16} style={{ color: 'black' }} />,
  innerContent: [{
    name: 'add',
    icon: <Icon type="material" name="add-circle-outline" size={20} style={{ color: 'gray' }} />,
    onPress: () => {
      // navigation.navigate(HOME);
    }
  },
  {
    name: 'edit',
    icon: <Icon type="material" name="edit" size={20} style={{ color: 'gray' }} />,
    onPress: () => {
      // navigation.navigate(HOME);
    }
  },
  {
    name: 'remove',
    icon: <Icon type="material" name="delete-outline" size={20} style={{ color: 'gray' }} />,
    onPress: () => {
      // navigation.navigate(HOME);
    }
  }
  ]
},
{
  name: 'Expense',
  type: 'nested',
  onPress: () => { },
  icon: <Icon type="material" name="rule" size={16} style={{ color: 'gray' }} />,
  innerContent: [{
    name: 'add',
    icon: <Icon type="material" name="add-circle-outline" size={20} style={{ color: 'gray' }} />,
    onPress: () => {
      // navigation.navigate(HOME);
    }
  },
  {
    name: 'edit',
    icon: <Icon type="material" name="edit" size={20} style={{ color: 'gray' }} />,
    onPress: () => {
      // navigation.navigate(HOME);
    }
  },
  {
    name: 'remove',
    icon: <Icon type="material" name="delete-outline" size={20} style={{ color: 'gray' }} />,
    onPress: () => {
      // navigation.navigate(HOME);
    }
  }
  ]
},
{
  name: 'Loan To',
  type: 'nested',
  onPress: () => { },
  icon: <Icon type="ion" name="alarm-outline" size={20} style={{ color: 'green' }} />,
  innerContent: [{
    name: 'add',
    icon: <Icon type="material" name="add-circle-outline" size={20} style={{ color: 'gray' }} />,
    onPress: () => {
      // navigation.navigate(HOME);
    }
  },
  {
    name: 'edit',
    icon: <Icon type="material" name="edit" size={20} style={{ color: 'gray' }} />,
    onPress: () => {
      // navigation.navigate(HOME);
    }
  },
  {
    name: 'remove',
    icon: <Icon type="material" name="delete-outline" size={20} style={{ color: 'gray' }} />,
    onPress: () => {
      // navigation.navigate(HOME);
    }
  }
  ]
},
{
  name: 'Borrow',
  type: 'nested',
  onPress: () => { },
  icon: <Icon type="ion" name="alarm-outline" size={20} style={{ color: 'green' }} />,
  innerContent: [{
    name: 'add',
    icon: <Icon type="material" name="add-circle-outline" size={20} style={{ color: 'gray' }} />,
    onPress: () => {
      // navigation.navigate(HOME);
    }
  },
  {
    name: 'edit',
    icon: <Icon type="material" name="edit" size={20} style={{ color: 'gray' }} />,
    onPress: () => {
      // navigation.navigate(HOME);
    }
  },
  {
    name: 'remove',
    icon: <Icon type="material" name="delete-outline" size={20} style={{ color: 'gray' }} />,
    onPress: () => {
      // navigation.navigate(HOME);
    }
  }
  ]
},
{
  name: 'Found Transfer',
  type: 'nested',
  onPress: () => { },
  icon: <Icon type="ion" name="alarm-outline" size={20} style={{ color: 'green' }} />,
  innerContent: [{
    name: 'add',
    icon: <Icon type="material" name="add-circle-outline" size={20} style={{ color: 'gray' }} />,
    onPress: () => {
      // navigation.navigate(HOME);
    }
  },
  {
    name: 'edit',
    icon: <Icon type="material" name="edit" size={20} style={{ color: 'gray' }} />,
    onPress: () => {
      // navigation.navigate(HOME);
    }
  },
  {
    name: 'remove',
    icon: <Icon type="material" name="delete-outline" size={20} style={{ color: 'gray' }} />,
    onPress: () => {
      // navigation.navigate(HOME);
    }
  }
  ]
},
{
  name: 'Losses',
  type: 'nested',
  onPress: () => { },
  icon: <Icon type="ion" name="alarm-outline" size={20} style={{ color: 'green' }} />,
  innerContent: [{
    name: 'add',
    icon: <Icon type="material" name="add-circle-outline" size={20} style={{ color: 'gray' }} />,
    onPress: () => {
      // navigation.navigate(HOME);
    }
  },
  {
    name: 'edit',
    icon: <Icon type="material" name="edit" size={20} style={{ color: 'gray' }} />,
    onPress: () => {
      // navigation.navigate(HOME);
    }
  },
  {
    name: 'remove',
    icon: <Icon type="material" name="delete-outline" size={20} style={{ color: 'gray' }} />,
    onPress: () => {
      // navigation.navigate(HOME);
    }
  }
  ]
},

];