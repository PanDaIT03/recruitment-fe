import SearchBar from '~/components/SearchBar/SearchBar';

const JobSeeker = () => {
  const handleSearch = (keyword: string, location: string) => {
    console.log(keyword);
    console.log(location);
  };

  return (
    <div className="min-h-screen">
      <SearchBar
        placeHolder="Tìm kiếm theo vị trí ứng tuyển"
        onSearch={handleSearch}
      />
    </div>
  );
};

export default JobSeeker;
