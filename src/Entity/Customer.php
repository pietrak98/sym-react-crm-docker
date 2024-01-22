<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiSubresource;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use App\Repository\CustomerRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass=CustomerRepository::class)
 * @ApiResource(
 *     collectionOperations={"get", "post"},
 *     itemOperations={"get", "put", "delete"},
 *     subresourceOperations={
 *          "invoices_get_subresource"={"path"="/customers/{id}/invoices"}
 *     },
 *     normalizationContext={
 *          "groups"={"customers_read"}
 *     }
 * )
 * in ApiResource, one can declare CRUD methods we want to enable
 * on the Resource on collection and item operations, change the path
 * (collectionOperations={"get"={"path"="/clients"}, "post"}, itemOperations={"get"={"path"="/clients/{id}"}, "put", "delete"})
 * the http methods needs to be in lowercase
 * For subresourceOperations, we define parameters about the subresource operations
 * @ApiFilter(SearchFilter::class,
 *   properties={
 *            "company": "partial",
 *       })
 * @ApiFilter(OrderFilter::class)
 */
class Customer
{

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"customers_read", "invoices_read"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"customers_read", "invoices_read"})
     * @Assert\Length(min="2", minMessage="The first name must be between 2 and 255 characters", max="255", maxMessage="The first name must be between 2 and 255 characters")
     * @Assert\NotBlank(message="The user firstName field should not be blank")
     */
    private $firstName;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"customers_read", "invoices_read"})
     * @Assert\Length(min="2", minMessage="The last name must be between 2 and 255 characters", max="255", maxMessage="The last name must be between 2 and 255 characters")
     * @Assert\NotBlank(message="The user lastName field should not be blank")
     */
    private $lastName;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"customers_read", "invoices_read"})
     * @Assert\Email(message="The given email address must be valid")
     * @Assert\Length(min="2", minMessage="The email address must be between 2 and 255 characters", max="255", maxMessage="The email address must be between 2 and 255 characters")
     * @Assert\NotBlank(message="The email address field should not be blank")
     */
    private $email;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"customers_read", "invoices_read"})
     * @Assert\Length(max="255", maxMessage="The company name must be shorter than 255 characters", allowEmptyString = true)
     */
    private $company;

    /**
     * @ORM\OneToMany(targetEntity=Invoice::class, mappedBy="customer")
     * @Groups({"customers_read"})
     * @ApiSubresource
     */
    private $invoices;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="customers")
     * @Groups({"customers_read"})
     * @Assert\NotBlank(message="The customer user field should not be blank")
     */
    private $user;

    public function __construct()
    {
        $this->invoices = new ArrayCollection();
    }

    /**
     * Return the total invoices amount per user
     * @return float
     * @Groups({"customers_read"})
     */
    public function getTotalAmount(): float
    {
        return array_reduce($this->invoices->toArray(), function ($total, $invoice) {
            return $total + $invoice->getAmount();
        }, 0);
    }

    /**
     * Return the total invoices amount not yed paid (total amount out from paid or cancelled invoices) per user
     * @return float
     * @Groups({"customers_read"})
     */
    public function getUnpaidAmount(): float
    {
        return array_reduce($this->invoices->toArray(), function ($total, $invoice) {
            return $total + ($invoice->getStatus() === 'PAID' || $invoice->getStatus() === 'CANCELED' ? 0 :
                    $invoice->getAmount());
        }, 0);
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFirstName(): ?string
    {
        return $this->firstName;
    }

    public function setFirstName(string $firstName): self
    {
        $this->firstName = $firstName;

        return $this;
    }

    public function getLastName(): ?string
    {
        return $this->lastName;
    }

    public function setLastName(string $lastName): self
    {
        $this->lastName = $lastName;

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

    public function setCompany(string $company): self
    {
        $this->company = $company;

        return $this;
    }

    /**
     * @return Collection|Invoice[]
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
        if ($this->invoices->contains($invoice)) {
            $this->invoices->removeElement($invoice);
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
