// Icon Options
export type BudgetIcon = 
      | 'Utensils'
      | 'Home'
      | 'Car'
      | 'GraduationCap'
      | 'Heart'
      | 'ShoppingCart'
      | 'Smartphone'
      | 'Plane'
      | 'Plane'
      | 'Briefcase'
      | 'Shield'
      | 'Gift'
      | 'Wallet';

// Color Options
export type BudgetColor = string;

//Main Buget
export interface Budget {
      id: number;
      name: string;
      icon: BudgetIcon;
      color: BudgetColor;
      allocated: number;                  // total budget allocated per month
      spent: number;                        // total spent
      carryOver: boolean;                 // balance caries to next month
      carryOverAmount: number;   // amount caried from prev month
      isSedekah: boolean;                 // sedekah budget marks
      isZakat: boolean;                      // zakat (auto-generated) budget marks
      isDefault: boolean;                 // budgets default (cant deleted)
}


//State for create or edit budget
export interface BudgetFormState {
      name: string;
      icon: BudgetIcon;
      color: BudgetColor;
      allocated: string;
      carryOver: boolean;
      isSedekah: boolean;
}


// Summary stats
export interface BudgetSummary {
      totalAllocated: number;
      totalSpent: number;
      totalRemaining: number;
      totalCarryOver: number;
}
