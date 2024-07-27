// src/components/ShareLink.tsx
import { useState } from "react";
import {
  Button,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { Share2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type ShareLinkProps = {
  filePath: string;
};

export default function ShareLink({ filePath }: ShareLinkProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [shareUrl, setShareUrl] = useState<string>("");
  const supabase = createClient();

  const generateShareLink = async () => {
    const { data, error } = await supabase.storage
      .from("Public")
      .createSignedUrl(filePath, 60 * 60 * 24); // 24 hours
    if (error) {
      console.error("Error generating share link:", error);
    } else if (data) {
      setShareUrl(data.signedUrl);
    }
    onOpen();
  };

  return (
    <>
      <Button
        isIconOnly
        color="secondary"
        aria-label="Share"
        onClick={generateShareLink}
      >
        <Share2 />
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>Share Link</ModalHeader>
          <ModalBody>
            <Input value={shareUrl} readOnly />
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onPress={() => navigator.clipboard.writeText(shareUrl)}
            >
              Copy Link
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
