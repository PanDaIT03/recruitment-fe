const useToken = () => {
  const token = localStorage.getItem('token1');
  const refreshToken = localStorage.getItem('token2');

  return { token, refreshToken };
};

export default useToken;
