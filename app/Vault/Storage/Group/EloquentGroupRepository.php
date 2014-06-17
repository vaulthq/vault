<?php
namespace Vault\Storage\Group;

class EloquentGroupRepository implements GroupRepository
{

    public function all()
    {
        return \Group::all();
    }

    public function find($id)
    {
        // TODO: Implement find() method.
    }

    public function insert($data)
    {
        // TODO: Implement insert() method.
    }

    public function update($id, $data)
    {
        // TODO: Implement update() method.
    }

    public function delete($id)
    {
        // TODO: Implement delete() method.
    }
}