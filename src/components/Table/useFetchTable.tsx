import { useEffect, useState } from "react";
import fakeData from "./fakeData.json";

export type FakeDataType = {
  name: string
  phone: string
  email: string
  address: string
}

const useDataFetching = () => {
  const [data, setData] = useState<FakeDataType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Fetch data asynchronously
    setTimeout(() => {
      setData(fakeData);
      setLoading(false);
    }, 2000);
  }, []);

  return { data, loading };
};

export { useDataFetching }