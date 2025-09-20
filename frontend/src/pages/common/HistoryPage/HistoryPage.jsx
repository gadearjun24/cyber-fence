import React, { useState, useEffect } from "react";
import axios from "axios";

import "./HistoryPage.css";
import FileModal from "../../../components/History/FileModal";
import HistoryTable from "../../../components/History/HistoryTable";
import FilterBar from "../../../components/History/FilterBar";
import Header from "../../../components/Header/Header";
import Pagination from "../../../components/History/Pagination";

const HistoryPage = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    type: "",
    prediction: "",
  });

  const fetchFiles = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/history`,
        {
          params: {
            ...filters,
            page: pagination.page,
            limit: pagination.limit,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setFiles(res.data.items || []);
      setPagination((prev) => ({
        ...prev,
        total: res.data.total,
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [filters, pagination.page]);

  const handleView = (file) => setSelectedFile(file);
  const handleCloseModal = () => setSelectedFile(null);

  return (
    <>
      <Header title="History" />
      <div className="history-page">
        <h2 className="page-title">File Upload History</h2>

        <FilterBar
          setLoading={setLoading}
          filters={filters}
          setFilters={setFilters}
        />

        <HistoryTable loading={loading} files={files} onView={handleView} />

        <Pagination
          total={pagination.total}
          page={pagination.page}
          limit={pagination.limit}
          onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
        />

        {selectedFile && (
          <FileModal file={selectedFile} onClose={handleCloseModal} />
        )}
      </div>
    </>
  );
};

export default HistoryPage;
