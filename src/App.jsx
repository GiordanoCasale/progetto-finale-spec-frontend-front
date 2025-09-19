import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DetailPage from "./pages/DetailPage";
import Navbar from "./components/Navbar";
import ComparatorPage from "./pages/ComparatorPage";
import FavoritesPage from "./pages/FavoritesPage";
import { FavoriteProvider } from "./contexts/FavoriteContext";

function App() {


  return (
    <FavoriteProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/detail/:id" element={<DetailPage />} />
          <Route path="/Comparator" element={<ComparatorPage />} />
          <Route path="/Favorites" element={<FavoritesPage />} />


        </Routes>
      </BrowserRouter >
    </FavoriteProvider>
  )
}

export default App
