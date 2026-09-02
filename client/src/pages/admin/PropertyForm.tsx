import { useState } from "react";
import PhotoGallery from "@/components/admin/PhotoGallery";
import { propertyOperationOptions } from "@/constants/propertyOperations";
import { propertyStatusOptions } from "@/constants/propertyStatus";
import { propertyTypeOptions } from "@/constants/propertyTypes";

type PropertyFormProps = {
  editingPropertyId: number | null;

  propertyCode: string;
  propertyTitle: string;
  propertySlug: string;
  propertyOperation: string;
  propertyType: string;
  propertyLocation: string;
  propertyPrice: string;
  propertyBedrooms: string;
  propertyBathrooms: string;
  propertyParkingSpots: string;
  propertySuites: string;
  propertyLavabos: string;
  propertyArea: string;
  propertyStatus: string;
  propertyDescription: string;
  propertyIsPublished: boolean;

  propertyImagePreviews: string[];
  propertyFormError: string;
  isSavingProperty: boolean;

  onCodeChange: (value: string) => void;
  onTitleChange: (value: string) => void;
  onSlugChange: (value: string) => void;
  onOperationChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onPriceChange: (value: string) => void;
  onBedroomsChange: (value: string) => void;
  onBathroomsChange: (value: string) => void;
  onParkingSpotsChange: (value: string) => void;
  onSuitesChange: (value: string) => void;
  onLavabosChange: (value: string) => void;
  onAreaChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onIsPublishedChange: (value: boolean) => void;

  onCoverImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
  onSave: () => void;
};

const propertyFormTabs = [
  { id: "general", label: "Geral" },
  { id: "features", label: "Características" },
  { id: "media", label: "Mídia" },
  { id: "publishing", label: "Publicação" },
] as const;

type PropertyFormTab = (typeof propertyFormTabs)[number]["id"];

export default function PropertyForm({
  editingPropertyId,

  propertyCode,
  propertyTitle,
  propertySlug,
  propertyOperation,
  propertyType,
  propertyLocation,
  propertyPrice,
  propertyBedrooms,
  propertyBathrooms,
  propertyParkingSpots,
  propertySuites,
  propertyLavabos,
  propertyArea,
  propertyStatus,
  propertyDescription,
  propertyIsPublished,

  propertyImagePreviews,
  propertyFormError,
  isSavingProperty,

  onCodeChange,
  onTitleChange,
  onSlugChange,
  onOperationChange,
  onTypeChange,
  onLocationChange,
  onPriceChange,
  onBedroomsChange,
  onBathroomsChange,
  onParkingSpotsChange,
  onSuitesChange,
  onLavabosChange,
  onAreaChange,
  onStatusChange,
  onDescriptionChange,
  onIsPublishedChange,

  onCoverImageChange,
  onCancel,
  onSave,
}: PropertyFormProps) {
  const [activeTab, setActiveTab] = useState<PropertyFormTab>("general");

  return (
    <div className="border border-border/20 rounded-sm p-6 mb-8">
      <div className="flex items-start justify-between gap-6 mb-8">
        <div>
          <h3 className="text-lg font-light">
            {editingPropertyId ? "Editar imóvel" : "Novo imóvel"}
          </h3>

          <p className="text-xs text-muted-foreground mt-1">
            Cadastro completo do imóvel no CMS da EXACT.
          </p>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          Cancelar
        </button>
      </div>

      <div className="mb-8 border-b border-border/20">
        <div className="flex flex-wrap gap-1">
          {propertyFormTabs.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`border-b px-4 py-3 text-[11px] uppercase tracking-[0.18em] transition-colors ${
                  isActive
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {activeTab === "general" && (
        <div className="space-y-8">
          <section>
            <p className="text-[11px] tracking-[0.22em] uppercase text-muted-foreground mb-5">
              Informações básicas
            </p>

            <div className="space-y-5">
              <input
                type="text"
                placeholder="Código do imóvel"
                value={propertyCode}
                onChange={(event) => onCodeChange(event.target.value)}
                className="w-full bg-transparent border border-border/40 rounded-sm px-4 py-3 text-sm font-light outline-none focus:border-foreground/40"
              />

              <input
                type="text"
                placeholder="Título"
                value={propertyTitle}
                onChange={(event) => onTitleChange(event.target.value)}
                className="w-full bg-transparent border border-border/40 rounded-sm px-4 py-3 text-sm font-light outline-none focus:border-foreground/40"
              />

              <input
                type="text"
                placeholder="Slug"
                value={propertySlug}
                onChange={(event) => onSlugChange(event.target.value)}
                className="w-full bg-transparent border border-border/40 rounded-sm px-4 py-3 text-sm font-light outline-none focus:border-foreground/40"
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <select
                  value={propertyOperation}
                  onChange={(event) => onOperationChange(event.target.value)}
                  className="w-full bg-background border border-border/40 rounded-sm px-4 py-3 text-sm font-light outline-none focus:border-foreground/40"
                >
                  <option value="">Operação</option>

                  {propertyOperationOptions.map((operationOption) => (
                    <option
                      key={operationOption.value}
                      value={operationOption.value}
                    >
                      {operationOption.label}
                    </option>
                  ))}
                </select>

                <select
                  value={propertyType}
                  onChange={(event) => onTypeChange(event.target.value)}
                  className="w-full bg-background border border-border/40 rounded-sm px-4 py-3 text-sm font-light outline-none focus:border-foreground/40"
                >
                  <option value="">Tipo do imóvel</option>

                  {propertyTypeOptions.map((propertyTypeOption) => (
                    <option
                      key={propertyTypeOption.value}
                      value={propertyTypeOption.value}
                    >
                      {propertyTypeOption.label}
                    </option>
                  ))}
                </select>

                <select
                  value={propertyStatus}
                  onChange={(event) => onStatusChange(event.target.value)}
                  className="w-full bg-background border border-border/40 rounded-sm px-4 py-3 text-sm font-light outline-none focus:border-foreground/40"
                >
                  <option value="">Status</option>

                  {propertyStatusOptions.map((statusOption) => (
                    <option key={statusOption.value} value={statusOption.value}>
                      {statusOption.label}
                    </option>
                  ))}
                </select>
              </div>

              <input
                type="text"
                placeholder="Localização"
                value={propertyLocation}
                onChange={(event) => onLocationChange(event.target.value)}
                className="w-full bg-transparent border border-border/40 rounded-sm px-4 py-3 text-sm font-light outline-none focus:border-foreground/40"
              />
            </div>
          </section>

          <section className="border-t border-border/15 pt-6">
            <p className="text-[11px] tracking-[0.22em] uppercase text-muted-foreground mb-5">
              Descrição
            </p>

            <textarea
              placeholder="Descrição"
              value={propertyDescription}
              onChange={(event) => onDescriptionChange(event.target.value)}
              className="min-h-36 w-full bg-transparent border border-border/40 rounded-sm px-4 py-3 text-sm font-light outline-none focus:border-foreground/40 resize-none"
            />
          </section>
        </div>
      )}

      {activeTab === "features" && (
        <section>
          <p className="text-[11px] tracking-[0.22em] uppercase text-muted-foreground mb-5">
            Características
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <input
              type="number"
              placeholder="Preço"
              value={propertyPrice}
              onChange={(event) => onPriceChange(event.target.value)}
              className="w-full bg-transparent border border-border/40 rounded-sm px-4 py-3 text-sm font-light outline-none focus:border-foreground/40"
            />

            <input
              type="number"
              placeholder="Área em m²"
              value={propertyArea}
              onChange={(event) => onAreaChange(event.target.value)}
              className="w-full bg-transparent border border-border/40 rounded-sm px-4 py-3 text-sm font-light outline-none focus:border-foreground/40"
            />

            <input
              type="number"
              placeholder="Quartos"
              value={propertyBedrooms}
              onChange={(event) => onBedroomsChange(event.target.value)}
              className="w-full bg-transparent border border-border/40 rounded-sm px-4 py-3 text-sm font-light outline-none focus:border-foreground/40"
            />

            <input
              type="number"
              placeholder="Banheiros"
              value={propertyBathrooms}
              onChange={(event) => onBathroomsChange(event.target.value)}
              className="w-full bg-transparent border border-border/40 rounded-sm px-4 py-3 text-sm font-light outline-none focus:border-foreground/40"
            />

            <input
              type="number"
              placeholder="Vagas de garagem"
              value={propertyParkingSpots}
              onChange={(event) => onParkingSpotsChange(event.target.value)}
              className="w-full bg-transparent border border-border/40 rounded-sm px-4 py-3 text-sm font-light outline-none focus:border-foreground/40"
            />

            <input
              type="number"
              placeholder="Suítes"
              value={propertySuites}
              onChange={(event) => onSuitesChange(event.target.value)}
              className="w-full bg-transparent border border-border/40 rounded-sm px-4 py-3 text-sm font-light outline-none focus:border-foreground/40"
            />

            <input
              type="number"
              placeholder="Lavabos"
              value={propertyLavabos}
              onChange={(event) => onLavabosChange(event.target.value)}
              className="w-full bg-transparent border border-border/40 rounded-sm px-4 py-3 text-sm font-light outline-none focus:border-foreground/40"
            />
          </div>
        </section>
      )}

      {activeTab === "media" && (
        <PhotoGallery
          preview={propertyImagePreviews[0] ?? ""}
          onChange={onCoverImageChange}
        />
      )}

      {activeTab === "publishing" && (
        <section className="space-y-6">
          <p className="text-[11px] tracking-[0.22em] uppercase text-muted-foreground mb-5">
            Publicação
          </p>

          <label className="flex items-center gap-3 text-xs text-muted-foreground">
            <input
              type="checkbox"
              checked={propertyIsPublished}
              onChange={(event) => onIsPublishedChange(event.target.checked)}
            />
            Publicado no site
          </label>

        </section>
      )}

      {propertyFormError && (
        <p className="text-xs text-red-400 mt-6">{propertyFormError}</p>
      )}

      <div className="flex justify-end mt-8">
        <button
          type="button"
          onClick={onSave}
          disabled={isSavingProperty}
          className="border border-foreground/20 rounded-sm px-6 py-2 text-xs font-light hover:bg-foreground hover:text-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSavingProperty
            ? "Salvando..."
            : editingPropertyId
              ? "Salvar alterações"
              : "Salvar imóvel"}
        </button>
      </div>
    </div>
  );
}

