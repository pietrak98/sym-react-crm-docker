<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240122194132 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE INDEX idx_company ON customer (company)');
        $this->addSql('CREATE INDEX idx_status ON invoice (status)');
        $this->addSql('CREATE INDEX idx_chrono ON invoice (chrono)');
        $this->addSql('CREATE INDEX idx_amount ON invoice (amount)');
        $this->addSql('CREATE INDEX idx_sentAt ON invoice (sent_at)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP INDEX idx_company ON customer');
        $this->addSql('DROP INDEX idx_status ON invoice');
        $this->addSql('DROP INDEX idx_chrono ON invoice');
        $this->addSql('DROP INDEX idx_amount ON invoice');
        $this->addSql('DROP INDEX idx_sentAt ON invoice');
    }
}
