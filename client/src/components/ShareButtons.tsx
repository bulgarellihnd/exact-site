import { Share2, MessageCircle, Facebook, Twitter, Linkedin, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface ShareButtonsProps {
  propertyId: string;
  propertyName: string;
  propertyPrice: string;
  propertyLocation: string;
}

export default function ShareButtons({
  propertyId,
  propertyName,
  propertyPrice,
  propertyLocation,
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const shareUrl = `${window.location.origin}/imoveis/${propertyId}`;
  const shareText = `${propertyName} - ${propertyLocation} - ${propertyPrice}`;
  const fullText = `Confira este imóvel: ${shareText}\n${shareUrl}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(fullText);
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const handleFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      '_blank'
    );
  };

  const handleTwitter = () => {
    const text = encodeURIComponent(`Confira este imóvel: ${shareText}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const handleLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      '_blank'
    );
  };

  return (
    <div className="relative">
      <motion.button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 px-4 py-2 border border-gray-700 rounded-lg text-gray-300 hover:text-white hover:border-gray-500 transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Share2 size={18} />
        <span className="text-sm">COMPARTILHAR</span>
      </motion.button>

      {showMenu && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full mt-2 right-0 bg-gray-900 border border-gray-700 rounded-lg shadow-lg p-3 z-50 w-56"
        >
          <div className="space-y-2">
            {/* WhatsApp */}
            <motion.button
              onClick={handleWhatsApp}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200 text-gray-300 hover:text-white"
              whileHover={{ x: 4 }}
            >
              <MessageCircle size={18} className="text-green-500" />
              <span className="text-sm">WhatsApp</span>
            </motion.button>

            {/* Facebook */}
            <motion.button
              onClick={handleFacebook}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200 text-gray-300 hover:text-white"
              whileHover={{ x: 4 }}
            >
              <Facebook size={18} className="text-blue-600" />
              <span className="text-sm">Facebook</span>
            </motion.button>

            {/* Twitter */}
            <motion.button
              onClick={handleTwitter}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200 text-gray-300 hover:text-white"
              whileHover={{ x: 4 }}
            >
              <Twitter size={18} className="text-blue-400" />
              <span className="text-sm">Twitter</span>
            </motion.button>

            {/* LinkedIn */}
            <motion.button
              onClick={handleLinkedIn}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200 text-gray-300 hover:text-white"
              whileHover={{ x: 4 }}
            >
              <Linkedin size={18} className="text-blue-700" />
              <span className="text-sm">LinkedIn</span>
            </motion.button>

            {/* Copy Link */}
            <motion.button
              onClick={handleCopyLink}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200 text-gray-300 hover:text-white"
              whileHover={{ x: 4 }}
            >
              {copied ? (
                <>
                  <Check size={18} className="text-green-500" />
                  <span className="text-sm">Copiado!</span>
                </>
              ) : (
                <>
                  <Copy size={18} />
                  <span className="text-sm">Copiar Link</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Close menu when clicking outside */}
      {showMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
}
