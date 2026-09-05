import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import PropertyForm from "./admin/PropertyForm";
import ImovelwebImport from "./admin/ImovelwebImport";

type Property = {
  id: number;
  property_code: string | null;
  title: string | null;
  slug: string | null;
  operation: string | null;
  property_type: string | null;
  location: string | null;
  price: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  area: number | null;
  parking_spots: number | null;
  suites: number | null;
  lavabos: number | null;
  status: string | null;
  description: string | null;
  cover_image: string | null;
  is_published: boolean | null;
};

type PropertyImage = {
  id: number;
  property_id: number | null;
  image_url: string | null;
  storage_path: string | null;
  sort_order: number | null;
  is_cover: boolean | null;
};

type UploadedPropertyImage = {
  image_url: string;
  storage_path: string;
  sort_order: number;
  is_cover: boolean;
};

export default function Admin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [properties, setProperties] = useState<Property[]>([]);
  const [propertiesError, setPropertiesError] = useState("");

  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [editingPropertyId, setEditingPropertyId] = useState<number | null>(
    null
  );

  const [propertyCode, setPropertyCode] = useState("");
  const [propertyTitle, setPropertyTitle] = useState("");
  const [propertySlug, setPropertySlug] = useState("");
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

  const [propertyOperation, setPropertyOperation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [propertyLocation, setPropertyLocation] = useState("");
  const [propertyPrice, setPropertyPrice] = useState("");
  const [propertyBedrooms, setPropertyBedrooms] = useState("");
  const [propertyBathrooms, setPropertyBathrooms] = useState("");
  const [propertyArea, setPropertyArea] = useState("");
  const [propertyParkingSpaces, setPropertyParkingSpaces] = useState("");
  const [propertySuites, setPropertySuites] = useState("");
  const [propertyLavabos, setPropertyLavabos] = useState("");
  const [propertyStatus, setPropertyStatus] = useState("Disponível");
  const [propertyDescription, setPropertyDescription] = useState("");
  const [propertyIsPublished, setPropertyIsPublished] = useState(true);

  const [propertyCoverImage, setPropertyCoverImage] = useState("");
  const [propertyImageFiles, setPropertyImageFiles] = useState<File[]>([]);
  const [propertyImages, setPropertyImages] = useState<PropertyImage[]>([]);
  const [propertyImagePreviews, setPropertyImagePreviews] = useState<string[]>(
    []
  );

  const [isSavingProperty, setIsSavingProperty] = useState(false);
  const [propertyFormError, setPropertyFormError] = useState("");

  const [deleteError, setDeleteError] = useState("");
  const [deletingPropertyId, setDeletingPropertyId] = useState<number | null>(
    null
  );
  const [updatingImageId, setUpdatingImageId] = useState<number | null>(null);
  const [draggedImageId, setDraggedImageId] = useState<number | null>(null);
  const [publishingPropertyId, setPublishingPropertyId] = useState<
    number | null
  >(null);

  const propertyCoverImagePreview =
    propertyCoverImage || propertyImagePreviews[0] || "";

  useEffect(() => {
    async function checkSession() {
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        setIsAuthenticated(true);
        await loadProperties();
      }

      setIsLoading(false);
    }

    checkSession();
  }, []);

  async function loadProperties() {
    setPropertiesError("");

    const { data, error } = await supabase
      .from("properties")
     .select(
"id, property_code, title, slug, operation, property_type, location, price, bedrooms, bathrooms, area, parking_spots, suites, lavabos, status, description, cover_image, is_published")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao carregar imóveis:", error);
      setPropertiesError("Não foi possível carregar os imóveis.");
      return;
    }

    setProperties(data ?? []);
  }

  async function loadPropertyImages(propertyId: number) {
    const { data, error } = await supabase
      .from("property_images")
      .select("id, property_id, image_url, storage_path, sort_order, is_cover")
      .eq("property_id", propertyId)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Erro ao carregar imagens do imóvel:", error);
      setPropertyFormError("Não foi possível carregar as fotos do imóvel.");
      setPropertyImages([]);
      setPropertyImagePreviews([]);
      return [];
    }

    const loadedImages = data ?? [];

    setPropertyImages(loadedImages);
    setPropertyImagePreviews(
      loadedImages
        .map((image) => image.image_url)
        .filter((imageUrl): imageUrl is string => Boolean(imageUrl))
    );

    return loadedImages;
  }

  function generateSlug(value: string) {
    return value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function normalizeManualSlug(value: string) {
    return value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-");
  }

  function handleTitleChange(value: string) {
    setPropertyTitle(value);

    if (!isSlugManuallyEdited) {
      setPropertySlug(generateSlug(value));
    }
  }

  function handleSlugChange(value: string) {
    setIsSlugManuallyEdited(true);
    setPropertySlug(normalizeManualSlug(value));
  }

  function parseNumber(value: string) {
    if (!value) return null;

    const normalizedValue = value.replace(/\./g, "").replace(",", ".");
    const parsedValue = Number(normalizedValue);

    if (Number.isNaN(parsedValue)) return null;

    return parsedValue;
  }

  function parseInteger(value: string) {
    if (!value) return null;

    const parsedValue = Number.parseInt(value, 10);

    if (Number.isNaN(parsedValue)) return null;

    return parsedValue;
  }

  function getFileExtension(file: File) {
    const fileExtension = file.name.split(".").pop();

    if (!fileExtension) return "jpg";

    return fileExtension.toLowerCase();
  }

  function getStoragePathFromPublicUrl(url: string | null) {
    if (!url) return null;

    const marker = "/storage/v1/object/public/properties/";
    const markerIndex = url.indexOf(marker);

    if (markerIndex === -1) return null;

    return decodeURIComponent(url.slice(markerIndex + marker.length));
  }

  async function getNextImageSortOrder(propertyId: number) {
    const { data, error } = await supabase
      .from("property_images")
      .select("sort_order")
      .eq("property_id", propertyId)
      .order("sort_order", { ascending: false })
      .limit(1);

    if (error) {
      console.error("Erro ao buscar ordem das imagens:", error);
      throw new Error("Não foi possível preparar as imagens.");
    }

    const lastSortOrder = data?.[0]?.sort_order;

    if (!lastSortOrder) return 1;

    return Number(lastSortOrder) + 1;
  }

  async function uploadPropertyImages(propertyId: number, files: File[]) {
    if (files.length === 0) return [];

    const firstSortOrder = await getNextImageSortOrder(propertyId);
    const uploadedImages: UploadedPropertyImage[] = [];

    for (const [index, file] of files.entries()) {
      const sortOrder = firstSortOrder + index;
      const fileExtension = getFileExtension(file);
      const fileName = `${Date.now()}-${crypto.randomUUID()}.${fileExtension}`;
      const filePath = `property-images/${propertyId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("properties")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("Erro ao fazer upload da imagem:", uploadError);
        throw new Error("Não foi possível enviar uma das imagens.");
      }

      const { data } = supabase.storage.from("properties").getPublicUrl(filePath);

      uploadedImages.push({
        image_url: data.publicUrl,
        storage_path: filePath,
        sort_order: sortOrder,
        is_cover: sortOrder === 1,
      });
    }

    const { error: insertError } = await supabase.from("property_images").insert(
      uploadedImages.map((image) => ({
        property_id: propertyId,
        image_url: image.image_url,
        storage_path: image.storage_path,
        sort_order: image.sort_order,
        is_cover: image.is_cover,
      }))
    );

    if (insertError) {
      console.error("Erro ao salvar imagens do imóvel:", insertError);
      throw new Error("Não foi possível salvar as imagens do imóvel.");
    }

    return uploadedImages;
  }

  async function updatePropertyCoverImage(
    propertyId: number,
    coverImage: string | null
  ) {
    const { error } = await supabase
      .from("properties")
      .update({ cover_image: coverImage })
      .eq("id", propertyId);

    if (error) {
      console.error("Erro ao atualizar foto principal:", error);
      throw new Error("Não foi possível atualizar a foto principal.");
    }
  }

  async function deleteFilesFromStorage(paths: string[]) {
    if (paths.length === 0) return;

    const { error } = await supabase.storage.from("properties").remove(paths);

    if (error) {
      console.error("Erro ao excluir arquivos do Storage:", error);
    }
  }

  async function deletePropertyImagesFromStorage(propertyId: number) {
    const { data, error } = await supabase
      .from("property_images")
      .select("storage_path")
      .eq("property_id", propertyId);

    if (error) {
      console.error("Erro ao buscar imagens para exclusão:", error);
      return;
    }

    const storagePaths =
      data
        ?.map((image: Pick<PropertyImage, "storage_path">) => image.storage_path)
        .filter((storagePath): storagePath is string => Boolean(storagePath)) ??
      [];

    await deleteFilesFromStorage(storagePaths);
  }

  async function deleteCoverImageFromStorage(url: string | null) {
    const storagePath = getStoragePathFromPublicUrl(url);

    if (!storagePath) return;

    await deleteFilesFromStorage([storagePath]);
  }

  async function handleTogglePublished(property: Property) {
    setDeleteError("");
    setPublishingPropertyId(property.id);

    const nextValue = !(property.is_published ?? false);

    const { error } = await supabase
      .from("properties")
      .update({ is_published: nextValue })
      .eq("id", property.id);

    if (error) {
      console.error("Erro ao alterar publicação:", error);
      setDeleteError("Não foi possível alterar a publicação do imóvel.");
      setPublishingPropertyId(null);
      return;
    }

    setProperties((currentProperties) =>
      currentProperties.map((currentProperty) =>
        currentProperty.id === property.id
          ? { ...currentProperty, is_published: nextValue }
          : currentProperty
      )
    );

    if (editingPropertyId === property.id) {
      setPropertyIsPublished(nextValue);
    }

    setPublishingPropertyId(null);
  }

  async function handleSetCoverImage(image: PropertyImage) {
    if (!editingPropertyId || !image.image_url) return;

    setPropertyFormError("");
    setUpdatingImageId(image.id);

    const { error: resetError } = await supabase
      .from("property_images")
      .update({ is_cover: false })
      .eq("property_id", editingPropertyId);

    if (resetError) {
      console.error("Erro ao limpar capa anterior:", resetError);
      setPropertyFormError("Não foi possível alterar a foto principal.");
      setUpdatingImageId(null);
      return;
    }

    const { error: coverError } = await supabase
      .from("property_images")
      .update({ is_cover: true })
      .eq("id", image.id);

    if (coverError) {
      console.error("Erro ao definir nova capa:", coverError);
      setPropertyFormError("Não foi possível alterar a foto principal.");
      setUpdatingImageId(null);
      return;
    }

    try {
      await updatePropertyCoverImage(editingPropertyId, image.image_url);
      setPropertyCoverImage(image.image_url);
      await loadPropertyImages(editingPropertyId);
      await loadProperties();
    } catch (error) {
      console.error(error);
      setPropertyFormError("Não foi possível alterar a foto principal.");
    }

    setUpdatingImageId(null);
  }

  async function handleDeletePropertyImage(image: PropertyImage) {
    if (!editingPropertyId) return;

    const shouldDelete = window.confirm("Deseja excluir esta foto?");

    if (!shouldDelete) return;

    setPropertyFormError("");
    setUpdatingImageId(image.id);

    if (image.storage_path) {
      await deleteFilesFromStorage([image.storage_path]);
    }

    const { error: deleteImageError } = await supabase
      .from("property_images")
      .delete()
      .eq("id", image.id);

    if (deleteImageError) {
      console.error("Erro ao excluir imagem:", deleteImageError);
      setPropertyFormError("Não foi possível excluir a foto.");
      setUpdatingImageId(null);
      return;
    }

    const remainingImages = propertyImages.filter(
      (propertyImage) => propertyImage.id !== image.id
    );

    const deletedCover =
      image.is_cover === true || propertyCoverImage === image.image_url;

    if (deletedCover) {
      const nextCoverImage = remainingImages[0];

      if (nextCoverImage?.image_url) {
        const { error: resetError } = await supabase
          .from("property_images")
          .update({ is_cover: false })
          .eq("property_id", editingPropertyId);

        if (resetError) {
          console.error("Erro ao resetar capas:", resetError);
        }

        const { error: nextCoverError } = await supabase
          .from("property_images")
          .update({ is_cover: true })
          .eq("id", nextCoverImage.id);

        if (nextCoverError) {
          console.error("Erro ao definir próxima capa:", nextCoverError);
        }

        await updatePropertyCoverImage(
          editingPropertyId,
          nextCoverImage.image_url
        );
        setPropertyCoverImage(nextCoverImage.image_url);
      } else {
        await updatePropertyCoverImage(editingPropertyId, null);
        setPropertyCoverImage("");
      }
    }

    await loadPropertyImages(editingPropertyId);
    await loadProperties();
    setUpdatingImageId(null);
  }

  async function handleReorderPropertyImage(targetImage: PropertyImage) {
    if (!editingPropertyId || !draggedImageId || draggedImageId === targetImage.id) {
      setDraggedImageId(null);
      return;
    }

    const draggedIndex = propertyImages.findIndex(
      (propertyImage) => propertyImage.id === draggedImageId
    );
    const targetIndex = propertyImages.findIndex(
      (propertyImage) => propertyImage.id === targetImage.id
    );

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedImageId(null);
      return;
    }

    const reorderedImages = [...propertyImages];
    const [draggedImage] = reorderedImages.splice(draggedIndex, 1);
    reorderedImages.splice(targetIndex, 0, draggedImage);

    setPropertyImages(reorderedImages);

    const pendingPreviews = propertyImagePreviews.slice(propertyImages.length);
    setPropertyImagePreviews([
      ...reorderedImages
        .map((propertyImage) => propertyImage.image_url)
        .filter((imageUrl): imageUrl is string => Boolean(imageUrl)),
      ...pendingPreviews,
    ]);

    setPropertyFormError("");
    setUpdatingImageId(draggedImage.id);

    const updates = reorderedImages.map((propertyImage, index) =>
      supabase
        .from("property_images")
        .update({ sort_order: index + 1 })
        .eq("id", propertyImage.id)
    );

    const results = await Promise.all(updates);
    const reorderError = results.find((result) => result.error)?.error;

    if (reorderError) {
      console.error("Erro ao reordenar imagens:", reorderError);
      setPropertyFormError("Não foi possível alterar a ordem das fotos.");
      await loadPropertyImages(editingPropertyId);
      setUpdatingImageId(null);
      setDraggedImageId(null);
      return;
    }

    await loadPropertyImages(editingPropertyId);
    setUpdatingImageId(null);
    setDraggedImageId(null);
  }

  async function handleMovePropertyImage(
    image: PropertyImage,
    direction: "up" | "down"
  ) {
    if (!editingPropertyId) return;

    const currentIndex = propertyImages.findIndex(
      (propertyImage) => propertyImage.id === image.id
    );

    if (currentIndex === -1) return;

    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const targetImage = propertyImages[targetIndex];

    if (!targetImage) return;

    setPropertyFormError("");
    setUpdatingImageId(image.id);

    const currentSortOrder = image.sort_order ?? currentIndex + 1;
    const targetSortOrder = targetImage.sort_order ?? targetIndex + 1;

    const { error: currentError } = await supabase
      .from("property_images")
      .update({ sort_order: targetSortOrder })
      .eq("id", image.id);

    const { error: targetError } = await supabase
      .from("property_images")
      .update({ sort_order: currentSortOrder })
      .eq("id", targetImage.id);

    if (currentError || targetError) {
      console.error("Erro ao reordenar imagens:", currentError || targetError);
      setPropertyFormError("Não foi possível alterar a ordem das fotos.");
      setUpdatingImageId(null);
      return;
    }

    await loadPropertyImages(editingPropertyId);
    setUpdatingImageId(null);
  }

  function handleRemovePendingImage(index: number) {
    const previewIndex = propertyImages.length + index;
    const previewUrl = propertyImagePreviews[previewIndex];

    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    setPropertyImageFiles((currentFiles) =>
      currentFiles.filter((_, fileIndex) => fileIndex !== index)
    );

    setPropertyImagePreviews((currentPreviews) =>
      currentPreviews.filter((_, currentIndex) => currentIndex !== previewIndex)
    );

    if (propertyCoverImage === previewUrl) {
      setPropertyCoverImage(propertyImagePreviews[0] ?? "");
    }
  }

  async function handleSaveProperty() {
    setPropertyFormError("");

    if (
      !propertyTitle ||
      !propertySlug ||
      !propertyOperation ||
      !propertyType ||
      !propertyLocation
    ) {
      setPropertyFormError("Preencha título, slug, operação, tipo e localização.");
      return;
    }

    setIsSavingProperty(true);

    try {
      const cleanSlug = propertySlug.replace(/^-+|-+$/g, "");

      const propertyData = {
        property_code: propertyCode || null,
        title: propertyTitle,
        slug: cleanSlug,
        operation: propertyOperation,
        property_type: propertyType,
        location: propertyLocation,
        price: parseNumber(propertyPrice),
        bedrooms: parseInteger(propertyBedrooms),
        bathrooms: parseInteger(propertyBathrooms),
        area: parseInteger(propertyArea),
        parking_spots: parseInteger(propertyParkingSpaces),
        suites: parseInteger(propertySuites),
        lavabos: parseInteger(propertyLavabos),
        status: propertyStatus || null,
        description: propertyDescription || null,
        cover_image: propertyCoverImage.startsWith("blob:")
          ? null
          : propertyCoverImage || null,
        is_published: propertyIsPublished,
      };

      let savedPropertyId = editingPropertyId;

      if (editingPropertyId) {
        const { error } = await supabase
          .from("properties")
          .update(propertyData)
          .eq("id", editingPropertyId);

        if (error) {
          console.error("Erro ao editar imóvel:", error);
          setPropertyFormError("Não foi possível salvar as alterações.");
          setIsSavingProperty(false);
          return;
        }
      } else {
        const { data, error } = await supabase
          .from("properties")
          .insert(propertyData)
          .select("id")
          .single();

        if (error) {
          console.error("Erro ao cadastrar imóvel:", error);
          setPropertyFormError("Não foi possível cadastrar o imóvel.");
          setIsSavingProperty(false);
          return;
        }

        savedPropertyId = data.id;
      }

      if (!savedPropertyId) {
        setPropertyFormError("Não foi possível identificar o imóvel salvo.");
        setIsSavingProperty(false);
        return;
      }

      if (propertyImageFiles.length > 0) {
        const uploadedImages = await uploadPropertyImages(
          savedPropertyId,
          propertyImageFiles
        );

        const loadedImages = await loadPropertyImages(savedPropertyId);

        const coverImageFromGallery =
          loadedImages.find((image) => image.is_cover)?.image_url ??
          loadedImages[0]?.image_url ??
          uploadedImages.find((image) => image.is_cover)?.image_url ??
          "";

        if (coverImageFromGallery) {
          await updatePropertyCoverImage(savedPropertyId, coverImageFromGallery);
          setPropertyCoverImage(coverImageFromGallery);
        }
      }

      await loadProperties();
      resetPropertyForm();
      setShowPropertyForm(false);
      setIsSavingProperty(false);
    } catch (error) {
      console.error(error);
      setPropertyFormError("Não foi possível salvar o imóvel.");
      setIsSavingProperty(false);
    }
  }

  function handleStartNewProperty() {
    resetPropertyForm();
    setEditingPropertyId(null);
    setShowPropertyForm(true);
  }

  async function handleStartEditProperty(property: Property) {
    setEditingPropertyId(property.id);
    setPropertyCode(property.property_code ?? "");
    setPropertyTitle(property.title ?? "");
    setPropertySlug(property.slug ?? generateSlug(property.title ?? ""));
    setIsSlugManuallyEdited(false);
    setPropertyOperation(property.operation ?? "");
    setPropertyType(property.property_type ?? "");
    setPropertyLocation(property.location ?? "");
    setPropertyPrice(property.price ? String(property.price) : "");
    setPropertyBedrooms(property.bedrooms ? String(property.bedrooms) : "");
    setPropertyBathrooms(property.bathrooms ? String(property.bathrooms) : "");
    setPropertyArea(property.area ? String(property.area) : "");
    setPropertyParkingSpaces(
      property.parking_spots ? String(property.parking_spots) : ""
    );
    setPropertySuites(property.suites ? String(property.suites) : "");
    setPropertyLavabos(property.lavabos ? String(property.lavabos) : "");
    setPropertyStatus(property.status ?? "Disponível");
    setPropertyDescription(property.description ?? "");
    setPropertyIsPublished(property.is_published ?? true);
    setPropertyCoverImage(property.cover_image ?? "");
    setPropertyImageFiles([]);
    setPropertyImages([]);
    setPropertyImagePreviews([]);
    setPropertyFormError("");
    setShowPropertyForm(true);

    const loadedImages = await loadPropertyImages(property.id);

    const coverImageFromGallery =
      loadedImages.find((image) => image.is_cover)?.image_url ??
      property.cover_image ??
      loadedImages[0]?.image_url ??
      "";

    setPropertyCoverImage(coverImageFromGallery);
  }

  function handleCoverImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);

    if (files.length === 0) return;

    const hasInvalidFile = files.some((file) => !file.type.startsWith("image/"));

    if (hasInvalidFile) {
      setPropertyFormError("Selecione apenas arquivos de imagem válidos.");
      return;
    }

    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));

    setPropertyImageFiles((currentFiles) => [...currentFiles, ...files]);
    setPropertyImagePreviews((currentPreviews) => [
      ...currentPreviews,
      ...newPreviewUrls,
    ]);

    if (!propertyCoverImage && newPreviewUrls[0]) {
      setPropertyCoverImage(newPreviewUrls[0]);
    }

    setPropertyFormError("");
    event.target.value = "";
  }

  async function handleDeleteProperty(property: Property) {
    setDeleteError("");

    const propertyName = property.title ?? "este imóvel";
    const shouldDelete = window.confirm(`Deseja excluir ${propertyName}?`);

    if (!shouldDelete) return;

    setDeletingPropertyId(property.id);

    await deletePropertyImagesFromStorage(property.id);
    await deleteCoverImageFromStorage(property.cover_image);

    const { error } = await supabase
      .from("properties")
      .delete()
      .eq("id", property.id);

    if (error) {
      console.error("Erro ao excluir imóvel:", error);
      setDeleteError("Não foi possível excluir o imóvel.");
      setDeletingPropertyId(null);
      return;
    }

    await loadProperties();
    setDeletingPropertyId(null);
  }

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMessage("E-mail ou senha inválidos.");
      setIsLoading(false);
      return;
    }

    setIsAuthenticated(true);
    await loadProperties();
    setIsLoading(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setEmail("");
    setPassword("");
    setProperties([]);
    setPropertiesError("");
    setDeleteError("");
    setShowPropertyForm(false);
    resetPropertyForm();
  }

  function resetPropertyForm() {
    propertyImagePreviews.forEach((previewUrl) => {
      if (previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    });

    setPropertyCode("");
    setPropertyTitle("");
    setPropertySlug("");
    setIsSlugManuallyEdited(false);
    setPropertyOperation("");
    setPropertyType("");
    setPropertyLocation("");
    setPropertyPrice("");
    setPropertyBedrooms("");
    setPropertyBathrooms("");
    setPropertyArea("");
    setPropertyParkingSpaces("");
    setPropertySuites("");
    setPropertyLavabos("");
    setPropertyStatus("Disponível");
    setPropertyDescription("");
    setPropertyIsPublished(true);
    setPropertyCoverImage("");
    setPropertyImageFiles([]);
    setPropertyImages([]);
    setPropertyImagePreviews([]);
    setPropertyFormError("");
    setEditingPropertyId(null);
    setUpdatingImageId(null);
  }

  function handleCancelPropertyForm() {
    setShowPropertyForm(false);
    resetPropertyForm();
  }

  function formatOperation(operation: string | null) {
    if (operation === "locacao") return "Locação";
    if (operation === "aquisicao") return "Aquisição";
    return "Não informado";
  }

  function formatPrice(price: number | null) {
    if (!price) return "Sob consulta";

    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
    }).format(price);
  }

  function formatStatus(status: string | null) {
    return status || "Sem status";
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-sm font-light text-muted-foreground">
          Carregando...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-6">
          <div className="space-y-2 text-center">
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground">
              EXACT
            </p>
            <h1 className="text-3xl font-light">Acesso Administrativo</h1>
          </div>

          <div className="space-y-4">
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full bg-transparent border border-border/40 rounded-sm px-4 py-3 text-sm font-light outline-none focus:border-foreground/40"
              required
            />

            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full bg-transparent border border-border/40 rounded-sm px-4 py-3 text-sm font-light outline-none focus:border-foreground/40"
              required
            />
          </div>

          {errorMessage && (
            <p className="text-xs text-red-400 text-center">{errorMessage}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full border border-foreground/20 rounded-sm py-3 text-sm font-light hover:bg-foreground hover:text-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Entrar
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground px-8 py-8">
      <div className="flex items-center justify-between border-b border-border/20 pb-6">
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground">
            EXACT
          </p>
          <h1 className="text-3xl font-light mt-2">Painel Administrativo</h1>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="border border-border/40 rounded-sm px-4 py-2 text-xs font-light hover:bg-foreground hover:text-background transition-colors"
        >
          Sair
        </button>
      </div>

      <div className="py-10 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-light">Imóveis</h2>
          <p className="text-xs text-muted-foreground mt-1">
            {properties.length} imóveis cadastrados
          </p>
        </div>

        <button
          type="button"
          onClick={handleStartNewProperty}
          className="border border-foreground/20 rounded-sm px-5 py-2 text-xs font-light hover:bg-foreground hover:text-background transition-colors"
        >
          + Novo imóvel
        </button>
      </div>

      <ImovelwebImport onImported={loadProperties} />

      {showPropertyForm && (
        <div className="mb-10 space-y-6">
          <PropertyForm
            editingPropertyId={editingPropertyId}
            propertyCode={propertyCode}
            propertyTitle={propertyTitle}
            propertySlug={propertySlug}
            propertyOperation={propertyOperation}
            propertyType={propertyType}
            propertyLocation={propertyLocation}
            propertyPrice={propertyPrice}
            propertyBedrooms={propertyBedrooms}
            propertyBathrooms={propertyBathrooms}
            propertyArea={propertyArea}
            propertyParkingSpots={propertyParkingSpaces}
            propertySuites={propertySuites}
            propertyLavabos={propertyLavabos}
            propertyStatus={propertyStatus}
            propertyDescription={propertyDescription}
            propertyIsPublished={propertyIsPublished}
            propertyImagePreviews={propertyImagePreviews}
            propertyFormError={propertyFormError}
            isSavingProperty={isSavingProperty}
            onCodeChange={setPropertyCode}
            onTitleChange={handleTitleChange}
            onSlugChange={handleSlugChange}
            onOperationChange={setPropertyOperation}
            onTypeChange={setPropertyType}
            onLocationChange={setPropertyLocation}
            onPriceChange={setPropertyPrice}
            onBedroomsChange={setPropertyBedrooms}
            onBathroomsChange={setPropertyBathrooms}
            onAreaChange={setPropertyArea}
            onParkingSpotsChange={setPropertyParkingSpaces}
            onSuitesChange={setPropertySuites}
            onLavabosChange={setPropertyLavabos}
            onStatusChange={setPropertyStatus}
            onDescriptionChange={setPropertyDescription}
            onIsPublishedChange={setPropertyIsPublished}
            onCoverImageChange={handleCoverImageChange}
            onCancel={handleCancelPropertyForm}
            onSave={handleSaveProperty}
          />

          {(propertyImages.length > 0 || propertyImageFiles.length > 0) && (
            <div className="border border-border/20 rounded-sm p-5 space-y-4">
              <div>
                <h3 className="text-sm font-light">Fotos do imóvel</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Defina a capa, reorganize ou exclua fotos.
                </p>
              </div>

              {propertyImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {propertyImages.map((image, index) => {
                    const isDragging = draggedImageId === image.id;
                    const isUpdating = updatingImageId === image.id;

                    return (
                      <div
                        key={image.id}
                        draggable={!isUpdating}
                        onDragStart={() => setDraggedImageId(image.id)}
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={() => handleReorderPropertyImage(image)}
                        onDragEnd={() => setDraggedImageId(null)}
                        className={`group relative cursor-grab overflow-hidden rounded-sm border bg-background transition-all duration-200 active:cursor-grabbing ${
                          isDragging
                            ? "border-foreground/60 opacity-50"
                            : "border-border/20 hover:border-border/50"
                        }`}
                      >
                        <div className="relative aspect-[4/3] overflow-hidden">
                          {image.image_url && (
                            <img
                              src={image.image_url}
                              alt="Foto do imóvel"
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                            />
                          )}

                          <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/35" />

                          {image.is_cover && (
                            <div className="absolute left-2 top-2 bg-foreground text-background px-2 py-1 text-[10px] uppercase tracking-[0.15em]">
                              Capa
                            </div>
                          )}

                          <div className="absolute right-2 top-2 flex gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                handleSetCoverImage(image);
                              }}
                              disabled={image.is_cover === true || isUpdating}
                              className="rounded-sm bg-background/90 px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-foreground backdrop-blur-sm transition hover:bg-background disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              Capa
                            </button>

                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                handleDeletePropertyImage(image);
                              }}
                              disabled={isUpdating}
                              className="rounded-sm bg-background/90 px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-red-400 backdrop-blur-sm transition hover:bg-background disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              Excluir
                            </button>
                          </div>

                          <div className="absolute bottom-2 left-2 rounded-sm bg-background/80 px-2 py-1 text-[10px] uppercase tracking-[0.15em] text-muted-foreground opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                            Arraste para reordenar
                          </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-border/20 px-3 py-2">
                          <span className="text-[10px] tracking-[0.16em] uppercase text-muted-foreground">
                            Foto {index + 1}
                          </span>

                          <span className="text-[10px] text-muted-foreground">
                            {isUpdating ? "Salvando..." : "Arrastar"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {propertyImageFiles.length > 0 && (
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground">
                    Novas fotos ainda não salvas
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {propertyImageFiles.map((file, index) => {
                      const previewUrl =
                        propertyImagePreviews[propertyImages.length + index];

                      return (
                        <div key={`${file.name}-${index}`} className="space-y-2">
                          <div className="aspect-[4/3] overflow-hidden rounded-sm border border-border/20 bg-background">
                            {previewUrl && (
                              <img
                                src={previewUrl}
                                alt={file.name}
                                className="h-full w-full object-cover"
                              />
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemovePendingImage(index)}
                            className="w-full border border-red-400/30 rounded-sm px-2 py-1 text-[10px] text-red-400 hover:text-red-300"
                          >
                            Remover
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {propertiesError && (
        <div className="border border-red-400/30 rounded-sm px-5 py-4 mb-6">
          <p className="text-xs text-red-400">{propertiesError}</p>
        </div>
      )}

      {deleteError && (
        <div className="border border-red-400/30 rounded-sm px-5 py-4 mb-6">
          <p className="text-xs text-red-400">{deleteError}</p>
        </div>
      )}

      <div className="border border-border/20 rounded-sm overflow-hidden">
        {properties.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <p className="text-sm font-light text-muted-foreground">
              Nenhum imóvel cadastrado ainda.
            </p>
          </div>
        ) : (
          properties.map((property) => (
            <div
              key={property.id}
              className="grid grid-cols-[96px_1fr_120px_120px_120px_120px_210px] gap-6 items-center border-b border-border/15 px-5 py-4 last:border-b-0"
            >
              <div className="h-16 w-24 overflow-hidden rounded-sm border border-border/20 bg-background">
                {property.cover_image ? (
                  <img
                    src={property.cover_image}
                    alt={property.title ?? "Imagem do imóvel"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="text-[10px] text-muted-foreground">
                      Sem imagem
                    </span>
                  </div>
                )}
              </div>

              <div>
                <p className="text-sm font-light">
                  {property.title ?? "Imóvel sem título"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {property.location ?? "Localização não informada"}
                </p>
              </div>

              <p className="text-xs text-muted-foreground">
                {formatOperation(property.operation)}
              </p>

              <p className="text-xs text-muted-foreground">
                {formatPrice(property.price)}
              </p>

              <p className="text-xs text-muted-foreground">
                {formatStatus(property.status)}
              </p>

              <button
                type="button"
                onClick={() => handleTogglePublished(property)}
                disabled={publishingPropertyId === property.id}
                className={`w-fit rounded-sm border px-3 py-1 text-[10px] uppercase tracking-[0.15em] transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  property.is_published
                    ? "border-emerald-400/30 text-emerald-400 hover:border-emerald-400/60"
                    : "border-zinc-500/30 text-muted-foreground hover:text-foreground"
                }`}
              >
                {publishingPropertyId === property.id
                  ? "Salvando"
                  : property.is_published
                    ? "Publicado"
                    : "Oculto"}
              </button>

              <div className="flex items-center justify-end gap-3">
                {property.property_code && (
                  <a
                    href={`/imoveis/${property.property_code}?preview=1`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    Visualizar
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => handleStartEditProperty(property)}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Editar
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteProperty(property)}
                  disabled={deletingPropertyId === property.id}
                  className="text-xs text-red-400 hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deletingPropertyId === property.id
                    ? "Excluindo..."
                    : "Excluir"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}


