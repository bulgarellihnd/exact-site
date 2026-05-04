import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Imoveis from "./pages/Imoveis";
import Sobre from "./pages/Sobre";
import Contato from "./pages/Contato";
import PropertyDetail from "./pages/PropertyDetail";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />

      <Route path="/vendas" component={Home} />
      <Route path="/aluguel" component={Home} />
      <Route path="/lancamentos" component={Home} />

      <Route path="/imoveis" component={Imoveis} />
      <Route path="/imoveis/:id" component={PropertyDetail} />

      <Route path="/sobre" component={Sobre} />
      <Route path="/contato" component={Contato} />

      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
