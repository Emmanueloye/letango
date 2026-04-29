import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import LandingLayout from './layouts/LandingLayout';
import Login, { action as loginAction } from './pages/auth/Login';
import Register, { action as signupAction } from './pages/auth/Register';
import VerifyEmail from './pages/auth/VerifyEmail';
import ResetPasswordLink, {
  action as ResetPasswordLinkAction,
} from './pages/auth/ResetPasswordLink';
import PasswordReset, {
  action as passwordResetAction,
} from './pages/auth/PasswordReset';
import DashBoardLayout, {
  loader as dashboardLoader,
} from './layouts/DashBoardLayout';
import Profile from './pages/auth/Profile';
import ProfileLayout from './layouts/ProfileLayout';
import ProfileUpdate, {
  action as ProfileUpdateAction,
} from './pages/auth/ProfileUpdate';
import PasswordUpdate, {
  action as PasswordUpdateAction,
} from './pages/auth/PasswordUpdate';
import Dashboard from './pages/Dashboard';
import ManageGroup, {
  loader as contributionsLoader,
} from './pages/userGroupMgt/ManageGroup';
import CreateGroup, {
  action as createGroupAction,
} from './pages/userGroupMgt/CreateGroup';
import EditGroup, {
  action as updateContributionAction,
  loader as updateContributionLoader,
} from './pages/userGroupMgt/EditGroup';
import KYC from './pages/userGroupMgt/KYC';
import PersonalWallet from './pages/wallet/PersonalWallet';
// import WalletTransaction from './pages/wallet/WalletTransaction';
// import TransactionFlow from './pages/wallet/TransactionFlow';
import GroupLayout from './layouts/GroupLayout';
import GroupView from './pages/userGroupMgt/GroupView';
import CreateGroupRules from './pages/userGroupMgt/CreateGroupRules';
import ViewGroupRules from './pages/userGroupMgt/ViewGroupRules';
import BeneficiaryDetails from './pages/userGroupMgt/BeneficiaryDetails';
import ContributeForm, {
  action as contributeAction,
} from './pages/userGroupMgt/ContributeForm';
import PaymentConfirmation, {
  loader as paymentConfirmLoader,
} from './pages/userGroupMgt/PaymentConfirmation';
import JoinContribution, {
  action as joinContributionAction,
} from './pages/userGroupMgt/JoinContribution';
import ContributionMembers, {
  loader as contributionMemberLoader,
  action as contributionMemberAction,
} from './pages/userGroupMgt/ContributionMembers';
import WithdrawContribution, {
  loader as withdrawContributionLoader,
  action as withdrawContributionAction,
} from './pages/userGroupMgt/WithdrawContribution';
import MyContributionTransaction from './pages/userGroupMgt/MyContributionTransaction';
// import GroupReportLanding from './pages/report/GroupReportLanding';
// import GroupTransactions from './pages/report/GroupTransactions';
// import GroupStatement from './pages/report/GroupStatement';
import UserManager, {
  loader as userManagerLoader,
} from './pages/admin/usersManager/UserManager';
import GroupManager, {
  loader as groupManagerLoader,
} from './pages/admin/groupManager/GroupManager';
import ContributionOpenWithdrawals, {
  loader as contributionOpenWithdrawalLoader,
} from './pages/admin/withdrawals/ContributionOpenWithdrawals';
import ContributionClosedWithdrawals, {
  loader as contributionClosedWithdrawalLoader,
} from './pages/admin/withdrawals/ContributionClosedWithdrawals';
import ContributionRejectedWithdrawls, {
  loader as rejectedContribution,
} from './pages/admin/withdrawals/ContributionRejectedWithdrawls';
// import ClosedWithdrawals from './pages/admin/withdrawals/ContributionClosedWithdrawals';
// import Statements from './pages/report/Statements';
import EditUser, {
  loader as editUserLoader,
  action as editUserAction,
} from './pages/admin/usersManager/EditUser';
import ViewUser, {
  loader as viewUserLoader,
} from './pages/admin/usersManager/ViewUser';
import EditAdminGroup, {
  loader as editAdminContributionLoader,
  action as editAdminContributionAction,
} from './pages/admin/groupManager/EditAdminGroup';
import ViewAdminGroup, {
  loader as viewAdminGroupLoader,
} from './pages/admin/groupManager/ViewAdminGroup';
import WithdrawalLanding from './pages/admin/withdrawals/WithdrawalLanding';
// import PendingWithdrawals from './pages/admin/withdrawals/PendingWithdrawals';
import KYCReview from './pages/admin/usersManager/KYCReview';
import ReportUser from './pages/userGroupMgt/ReportUser';
import ViewContributionWithdrawal from './pages/admin/withdrawals/ViewContributionWithdrawal';
import Settings, {
  loader as settingsLoader,
  action as settingsAction,
} from './pages/admin/settings/Settings';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'signup', element: <Register />, action: signupAction },
      { path: 'login', element: <Login />, action: loginAction },
      {
        path: 'verify-email',
        element: <VerifyEmail />,
      },
      {
        path: 'reset-password',
        element: <ResetPasswordLink />,
        action: ResetPasswordLinkAction,
      },
      {
        path: 'update-password',
        element: <PasswordReset />,
        action: passwordResetAction,
      },
      {
        path: 'join/:groupName',
        element: <JoinContribution />,
        action: joinContributionAction,
      },
    ],
  },
  {
    path: '/account',
    element: <DashBoardLayout />,
    loader: dashboardLoader,
    children: [
      { index: true, element: <Dashboard /> },
      {
        path: 'profile',
        element: <ProfileLayout />,
        children: [
          { index: true, element: <Profile /> },
          {
            path: 'edit-profile',
            element: <ProfileUpdate />,
            action: ProfileUpdateAction,
          },
          {
            path: 'change-password',
            element: <PasswordUpdate />,
            action: PasswordUpdateAction,
          },
        ],
      },
      {
        path: 'personal-wallet',
        children: [
          { index: true, element: <PersonalWallet /> },
          // {
          //   path: 'transactions',
          //   element: <WalletTransaction />,
          // },
          // { path: 'inflows', element: <TransactionFlow /> },
          // { path: 'outflows', element: <TransactionFlow /> },
        ],
      },

      {
        path: 'manage-group',

        children: [
          {
            index: true,
            element: <ManageGroup />,
            loader: contributionsLoader,
          },
          {
            path: 'create-group',
            element: <CreateGroup />,
            action: createGroupAction,
          },
          {
            path: 'update-group/:groupId',
            element: <EditGroup />,
            action: updateContributionAction,
            loader: updateContributionLoader,
          },
          {
            path: 'view/:groupId',

            element: <GroupLayout />,
            children: [
              { index: true, element: <GroupView /> },
              { path: 'manage-rules', element: <CreateGroupRules /> },
              { path: 'view-rules', element: <ViewGroupRules /> },
              { path: 'beneficiaries', element: <BeneficiaryDetails /> },
              {
                path: 'contribute',
                element: <ContributeForm />,
                action: contributeAction,
              },
              {
                path: 'contribute/confirm',
                element: <PaymentConfirmation />,
                loader: paymentConfirmLoader,
              },
              {
                path: 'members',

                children: [
                  {
                    index: true,
                    element: <ContributionMembers />,
                    loader: contributionMemberLoader,
                    action: contributionMemberAction,
                  },
                  {
                    path: 'unadmitted',
                    element: <ContributionMembers />,
                    loader: contributionMemberLoader,
                    action: contributionMemberAction,
                  },
                ],
              },
              {
                path: 'withdraw',
                element: <WithdrawContribution />,
                loader: withdrawContributionLoader,
                action: withdrawContributionAction,
              },
              {
                path: 'transactions',
                element: <MyContributionTransaction />,
              },
              // {
              //   path: 'reports',
              //   children: [
              //     { index: true, element: <GroupReportLanding /> },
              //     { path: 'transaction', element: <GroupTransactions /> },
              //     { path: 'statement', element: <GroupStatement /> },
              //   ],
              // },
            ],
          },
        ],
      },

      { path: 'kyc', element: <KYC /> },
      { path: 'report-user', element: <ReportUser /> },
      {
        path: 'admin',
        children: [
          { index: true, element: <p>admin</p> },
          {
            path: 'user-manager',
            children: [
              {
                index: true,
                element: <UserManager />,
                loader: userManagerLoader,
              },
              {
                path: 'edit/:userId',
                element: <EditUser />,
                loader: editUserLoader,
                action: editUserAction,
              },
              {
                path: 'view/:userId',
                element: <ViewUser />,
                loader: viewUserLoader,
              },
            ],
          },
          {
            path: 'contributions',
            children: [
              {
                index: true,
                element: <GroupManager />,
                loader: groupManagerLoader,
              },
              {
                path: 'edit/:contributionId',
                element: <EditAdminGroup />,
                loader: editAdminContributionLoader,
                action: editAdminContributionAction,
              },
              {
                path: 'view/:contributionId',
                element: <ViewAdminGroup />,
                loader: viewAdminGroupLoader,
              },
            ],
          },
          {
            path: 'withdrawals',
            children: [
              { index: true, element: <WithdrawalLanding /> },
              {
                path: 'contributions/open',
                element: <ContributionOpenWithdrawals />,
                loader: contributionOpenWithdrawalLoader,
              },
              {
                path: 'contributions/view/:withdrawalId',
                element: <ViewContributionWithdrawal />,
              },
              {
                path: 'contributions/closed',
                element: <ContributionClosedWithdrawals />,
                loader: contributionClosedWithdrawalLoader,
              },

              {
                path: 'contributions/rejected',
                element: <ContributionRejectedWithdrawls />,
                loader: rejectedContribution,
              },
            ],
          },
          // { path: 'closed-withdrawals', element: <ClosedWithdrawals /> },
          {
            path: 'settings',
            element: <Settings />,
            loader: settingsLoader,
            action: settingsAction,
          },
          { path: 'kyc-review', element: <KYCReview /> },
          // { path: 'statement', element: <Statements /> },
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
