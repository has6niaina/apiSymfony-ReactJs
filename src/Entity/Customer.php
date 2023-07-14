<?php

namespace App\Entity;

use ApiPlatform\Metadata\Get;
use Doctrine\ORM\Mapping as ORM;
use App\Repository\CustomerRepository;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Core\Annotation\ApiFilter;
use Doctrine\Common\Collections\Collection;
use ApiPlatform\Core\Annotation\ApiResource;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: CustomerRepository::class)]
#[ApiResource(
    collectionOperations: [
        'GET', 'POST'
    ],
    itemOperations: [
        'GET', 'PUT', 'DELETE'
    ],
    subresourceOperations: [
        'invoices' => [
            'method' => 'GET',
            'path' => '/customers/{id}/invoices',
        ]
    ],
    normalizationContext: ['groups' => ['customers_read']]
)]
class Customer
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    #[Groups(['customers_read','invoices_read'])]
    private $id;

    #[ORM\Column(type: 'string', length: 255)]
    #[Groups(['customers_read','invoices_read'])]
    #[Assert\NotBlank(message: "Le nom du customer est obligatoire")]
    #[Assert\Length(min:3, minMessage:"Le nom doit faire entre 3 caracteres", 
                    max:"255",maxMessage:"Le nom doit faire entre 3 caracteres")]
    private $firstname;

    #[ORM\Column(type: 'string', length: 255)]
    #[Groups(['customers_read','invoices_read'])]
    #[Assert\NotBlank(message: "Le nom du customer est obligatoire")]
    #[Assert\Length(min:3, minMessage:"Le prenom doit faire entre 3 caracteres", 
                    max:"255",maxMessage:"Le prenom doit faire entre 3 caracteres")]
    private $lastname;
    
    #[ORM\Column(type: 'string', length: 255)]
    #[Groups(['customers_read','invoices_read'])]
    #[Assert\NotBlank(message: "L'email du customer est obligatoire")]
    #[Assert\Email(message: "Le format doit etre valide")]
    private $email;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    #[Groups(['customers_read','invoices_read'])]
    private $company;

    #[ORM\OneToMany(mappedBy: 'customer', targetEntity: Invoice::class)]
    #[Groups(['customers_read'])]
    private $invoices;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'customers')]
    #[Groups(['customers_read','invoices_read'])]
    #[Assert\NotBlank(message: "L'utilisateur du customer est obligatoire")]
    private $user;

    public function __construct()
    {
        $this->invoices = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFirstname(): ?string
    {
        return $this->firstname;
    }

    public function setFirstname(string $firstname): self
    {
        $this->firstname = $firstname;

        return $this;
    }

    public function getLastname(): ?string
    {
        return $this->lastname;
    }

    public function setLastname(string $lastname): self
    {
        $this->lastname = $lastname;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    public function getCompany(): ?string
    {
        return $this->company;
    }

    public function setCompany(?string $company): self
    {
        $this->company = $company;

        return $this;
    }

    /**
     * @return Collection<int, Invoice>
     */
    public function getInvoices(): Collection
    {
        return $this->invoices;
    }

    public function addInvoice(Invoice $invoice): self
    {
        if (!$this->invoices->contains($invoice)) {
            $this->invoices[] = $invoice;
            $invoice->setCustomer($this);
        }

        return $this;
    }

    public function removeInvoice(Invoice $invoice): self
    {
        if ($this->invoices->removeElement($invoice)) {
            // set the owning side to null (unless already changed)
            if ($invoice->getCustomer() === $this) {
                $invoice->setCustomer(null);
            }
        }

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;
        return $this;
    }
}
