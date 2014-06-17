<?php
namespace Vault\Storage\Group;

interface GroupRepository
{
    public function all();
    public function find($id);
    public function insert($data);
    public function update($id, $data);
    public function delete($id);
}