import NotificationComponent from '~/components/Notification/Notification';
const Header = () => {
  return (
    <div className="p-5">
      <NotificationComponent userRole="user" />
    </div>
  );
};

export default Header;
