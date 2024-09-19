import TopSearchBar from '~/components/TopSearchBar/TopSearchBar';

const JobSeeker = () => {
  const handleSearch = (values: any) => {
    console.log(values);
  };

  return (
    <div className="min-h-[100vh]">
      <TopSearchBar
        placeHolder="Tìm kiếm theo vị trí ứng tuyển"
        onSearch={handleSearch}
      />
    </div>
  );
};

export default JobSeeker;
